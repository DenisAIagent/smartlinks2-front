import { LoginCredentials, RegisterData, AuthResponse, ApiError, ForgotPasswordData, ResetPasswordData, ForgotPasswordResponse, ResetPasswordResponse } from '@/types/auth';

// Configuration de l'API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://smartlink2-backend-production.up.railway.app/api';

// Classe pour gérer les erreurs d'API
export class ApiException extends Error {
  public status: number;
  public data: ApiError;

  constructor(status: number, data: ApiError) {
    super(data.error);
    this.status = status;
    this.data = data;
  }
}

// Configuration des headers par défaut
const getHeaders = (includeAuth: boolean = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = localStorage.getItem('access_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Fonction utilitaire pour faire des requêtes
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getHeaders(includeAuth),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new ApiException(response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    throw new ApiException(500, { error: 'Erreur de connexion au serveur' });
  }
};

// Services d'authentification
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, false);
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const { confirmPassword, ...registerData } = data;
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(registerData),
    }, false);
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
    return apiRequest<ForgotPasswordResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    }, false);
  },

  resetPassword: async (data: ResetPasswordData): Promise<ResetPasswordResponse> => {
    const { confirmPassword, ...resetData } = data;
    return apiRequest<ResetPasswordResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(resetData),
    }, false);
  },

  refreshToken: async (): Promise<{ access_token: string }> => {
    const refreshToken = localStorage.getItem('refresh_token');
    return apiRequest<{ access_token: string }>('/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
      },
    }, false);
  },

  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  updateProfile: async (data: any) => {
    return apiRequest('/auth/update-profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Services pour les smartlinks
export const smartlinkApi = {
  getAll: async () => {
    return apiRequest('/smartlinks');
  },

  getById: async (id: string) => {
    return apiRequest(`/smartlinks/${id}`);
  },

  getPublic: async (id: string) => {
    return apiRequest(`/public/smartlinks/${id}`, {}, false);
  },

  getLanding: async (id: string) => {
    return apiRequest(`/smartlinks/${id}/landing`, {}, false);
  },

  create: async (data: any) => {
    return apiRequest('/smartlinks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: any) => {
    return apiRequest(`/smartlinks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string) => {
    return apiRequest(`/smartlinks/${id}`, {
      method: 'DELETE',
    });
  },

  trackClick: async (id: string) => {
    return apiRequest(`/smartlinks/${id}/click`, {
      method: 'POST',
    }, false);
  },

  trackPlatformClick: async (smartlinkId: string, platformId: number) => {
    return apiRequest(`/smartlinks/${smartlinkId}/platforms/${platformId}/click`, {
      method: 'POST',
    }, false);
  },

  getAnalytics: async (id: string) => {
    return apiRequest(`/smartlinks/${id}/analytics`);
  },
};

// Services pour le proxy
export const proxyApi = {
  getOdesliData: async (url: string) => {
    return apiRequest(`/odesli-proxy?url=${encodeURIComponent(url)}`);
  },

  validateMusicUrl: async (url: string) => {
    return apiRequest('/validate-music-url', {
      method: 'POST',
      body: JSON.stringify({ url }),
    });
  },

  getSupportedPlatforms: async () => {
    return apiRequest('/supported-platforms', {}, false);
  },
};

// Interceptor pour gérer l'expiration des tokens
export const setupApiInterceptor = (refreshTokenCallback: () => Promise<void>, logoutCallback: () => void) => {
  // Cette fonction pourrait être étendue pour intercepter les réponses 401
  // et automatiquement rafraîchir les tokens
};
