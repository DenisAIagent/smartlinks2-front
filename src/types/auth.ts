export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  is_active: boolean;
  is_superadmin: boolean;
  subscription_status: 'pending' | 'active' | 'expired' | 'cancelled';
  subscription_end_date: string | null;
}

export interface AuthResponse {
  message: string;
  user: User;
  access_token: string;
  refresh_token: string;
  requires_payment?: boolean;
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
  login: (credentials: LoginCredentials) => Promise<{ requiresPayment: boolean; user: User } | undefined>;
  register: (data: RegisterData) => Promise<{ requiresPayment: boolean; user: User } | undefined>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export interface ApiError {
  error: string;
  message?: string;
}
