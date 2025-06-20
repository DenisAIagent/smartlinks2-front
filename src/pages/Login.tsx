import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { LoginCredentials } from '@/types/auth';
import { Eye, EyeOff, Loader2, Music } from 'lucide-react';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username_or_email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<LoginCredentials>>({});

  // Redirection après connexion
  const from = location.state?.from?.pathname || '/';

  const validateForm = (): boolean => {
    const newErrors: Partial<LoginCredentials> = {};

    if (!credentials.username_or_email.trim()) {
      newErrors.username_or_email = 'Nom d\'utilisateur ou email requis';
    }

    if (!credentials.password) {
      newErrors.password = 'Mot de passe requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
    // Nettoyer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (error) {
      // Les erreurs sont gérées dans le contexte d'auth
    }
  };

  const handleDemoLogin = async () => {
    // Fonction pour se connecter avec un compte de démonstration
    const demoCredentials: LoginCredentials = {
      username_or_email: 'demo@smartlinks.com',
      password: 'demo123456',
    };

    try {
      await login(demoCredentials);
      navigate(from, { replace: true });
    } catch (error) {
      // Fallback si le compte de démo n'existe pas
      console.log('Compte de démo non disponible');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Music className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
          <CardDescription>
            Connectez-vous à votre compte SmartLinks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username_or_email">
                Nom d'utilisateur ou Email
              </Label>
              <Input
                id="username_or_email"
                type="text"
                placeholder="Entrez votre nom d'utilisateur ou email"
                value={credentials.username_or_email}
                onChange={(e) => handleInputChange('username_or_email', e.target.value)}
                className={errors.username_or_email ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.username_or_email && (
                <p className="text-sm text-red-500">{errors.username_or_email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe"
                  value={credentials.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Ou
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleDemoLogin}
              disabled={isLoading}
            >
              Essayer le compte de démo
            </Button>

            <div className="text-center text-sm">
              Pas encore de compte ?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Créer un compte
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
