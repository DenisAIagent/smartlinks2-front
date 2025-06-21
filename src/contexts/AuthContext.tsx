import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials, RegisterData } from '@/types/auth';
import { authApi, ApiException } from '@/lib/api';
import { toast } from 'sonner';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Fonction pour sauvegarder les tokens
  const saveTokens = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    setToken(accessToken);
  };

  // Fonction pour nettoyer les tokens
  const clearTokens = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
  };

  // Fonction de connexion
  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      
      setUser(response.user);
      saveTokens(response.access_token, response.refresh_token);
      
      toast.success('Connexion réussie!');
      
      // Retourner les informations de redirection pour le paiement
      return {
        requiresPayment: response.requires_payment && !response.user.is_superadmin,
        user: response.user
      };
    } catch (error) {
      if (error instanceof ApiException) {
        toast.error(error.data.error);
      } else {
        toast.error('Erreur lors de la connexion');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction d'inscription
  const register = async (data: RegisterData) => {
    try {
      // Validation côté client
      if (data.password !== data.confirmPassword) {
        toast.error('Les mots de passe ne correspondent pas');
        throw new Error('Les mots de passe ne correspondent pas');
      }

      if (data.password.length < 8) {
        toast.error('Le mot de passe doit contenir au moins 8 caractères');
        throw new Error('Le mot de passe doit contenir au moins 8 caractères');
      }

      setIsLoading(true);
      const response = await authApi.register(data);
      
      setUser(response.user);
      saveTokens(response.access_token, response.refresh_token);
      
      toast.success('Compte créé avec succès!');
      
      // Retourner les informations de redirection pour le paiement
      return {
        requiresPayment: response.requires_payment && !response.user.is_superadmin,
        user: response.user
      };
    } catch (error) {
      if (error instanceof ApiException) {
        toast.error(error.data.error);
      } else if (error instanceof Error) {
        // Erreurs de validation côté client
        throw error;
      } else {
        toast.error('Erreur lors de l\'inscription');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de déconnexion
  const logout = () => {
    clearTokens();
    toast.success('Déconnexion réussie');
  };

  // Fonction pour rafraîchir le token
  const refreshToken = async () => {
    try {
      const response = await authApi.refreshToken();
      const refreshTokenValue = localStorage.getItem('refresh_token');
      
      if (refreshTokenValue) {
        saveTokens(response.access_token, refreshTokenValue);
      }
    } catch (error) {
      // Si le refresh token est invalide, déconnecter l'utilisateur
      clearTokens();
      toast.error('Session expirée, veuillez vous reconnecter');
    }
  };

  // Fonction pour récupérer l'utilisateur actuel
  const getCurrentUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      // Si on ne peut pas récupérer l'utilisateur, nettoyer les tokens
      clearTokens();
    }
  };

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('access_token');
      const storedRefreshToken = localStorage.getItem('refresh_token');

      if (storedToken && storedRefreshToken) {
        setToken(storedToken);
        
        try {
          await getCurrentUser();
        } catch (error) {
          // Si le token est invalide, essayer de le rafraîchir
          try {
            await refreshToken();
            await getCurrentUser();
          } catch (refreshError) {
            clearTokens();
          }
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Rafraîchir automatiquement le token avant expiration
  useEffect(() => {
    if (!token) return;

    // Rafraîchir le token toutes les 50 minutes (les tokens expirent en 1h)
    const interval = setInterval(() => {
      refreshToken();
    }, 50 * 60 * 1000);

    return () => clearInterval(interval);
  }, [token]);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
