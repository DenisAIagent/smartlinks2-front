export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  is_active: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
}

export interface LoginCredentials {
  username_or_email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export interface ApiError {
  error: string;
  message?: string;
}
