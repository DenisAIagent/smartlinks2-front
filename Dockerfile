FROM node:18-alpine as builder

# Install pnpm globally
RUN npm install -g pnpm@8.10.0

# Create app directory
WORKDIR /app

# Copy package files for better layer caching
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN --mount=type=cache,id=s/5491865c-914a-42b6-88c7-085afda2b626-/root/local/share/pnpm/store/v3,target=/root/.local/share/pnpm/store/v3 \
    pnpm i --frozen-lockfile

# Copy source code (excluding node_modules via .dockerignore)
COPY . .

# Build the application
RUN --mount=type=cache,id=s/5491865c-914a-42b6-88c7-085afda2b626-node_modules/cache,target=/app/node_modules/.cache \
    pnpm run build

# Production stage with optimized nginx
FROM nginx:1.25-alpine

# Install curl for health checks
RUN apk --no-cache add curl

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx cache directories
RUN mkdir -p /var/cache/nginx/client_temp && \
    mkdir -p /var/cache/nginx/proxy_temp && \
    mkdir -p /var/cache/nginx/fastcgi_temp && \
    mkdir -p /var/cache/nginx/uwsgi_temp && \
    mkdir -p /var/cache/nginx/scgi_temp

# Set proper permissions
RUN chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/log/nginx

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/health || exit 1

# Expose port
EXPOSE 80

# Use non-root user
USER nginx

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 