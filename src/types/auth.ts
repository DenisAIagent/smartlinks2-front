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

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<{ requiresPayment: boolean; user: User } | undefined>;
  register: (data: RegisterData) => Promise<{ requiresPayment: boolean; user: User } | undefined>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export interface ApiError {
  error: string;
  message?: string;
}
