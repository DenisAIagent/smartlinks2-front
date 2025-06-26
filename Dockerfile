FROM node:18-alpine as builder

# Install pnpm globally
RUN npm install -g pnpm@8.10.0

# Create app directory
WORKDIR /app

# Copy package files for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies - FIX CACHE IDS
RUN --mount=type=cache,id=pnpm-store,target=/root/.local/share/pnpm/store/v3 \
    pnpm i --frozen-lockfile

# Copy source code (excluding node_modules via .dockerignore)
COPY . .

# Build the application - FIX CACHE IDS
RUN --mount=type=cache,id=node-modules-cache,target=/app/node_modules/.cache \
    pnpm run build

# Production stage - VERSION RAILWAY COMPATIBLE
FROM nginx:1.25-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx directories with proper permissions for Railway
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp && \
    mkdir -p /tmp/nginx && \
    chmod -R 777 /var/cache/nginx && \
    chmod -R 777 /tmp/nginx && \
    chmod -R 755 /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx as root (Railway requirement)
CMD ["nginx", "-g", "daemon off;"]
