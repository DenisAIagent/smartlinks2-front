import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { RegisterData } from '@/types/auth';
import { Eye, EyeOff, Loader2, Music, Check, X } from 'lucide-react';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  
  const [formData, setFormData] = useState<RegisterData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterData>>({});

  // Validation en temps réel du mot de passe
  const getPasswordValidation = (password: string) => {
    return {
      length: password.length >= 8,
      letter: /[A-Za-z]/.test(password),
      number: /\d/.test(password),
    };
  };

  const passwordValidation = getPasswordValidation(formData.password);
  const isPasswordValid = passwordValidation.length && passwordValidation.letter && passwordValidation.number;

  const validateForm = (): boolean => {
    const newErrors: Partial<RegisterData> = {};

    // Validation du nom d'utilisateur
    if (!formData.username.trim()) {
      newErrors.username = 'Le nom d\'utilisateur est requis';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, traits d\'union et underscores';
    }

    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Validation du mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (!isPasswordValid) {
      newErrors.password = 'Le mot de passe ne respecte pas les critères requis';
    }

    // Validation de la confirmation du mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Nettoyer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await register(formData);
      navigate('/', { replace: true });
    } catch (error) {
      // Les erreurs sont gérées dans le contexte d'auth
    }
  };

  const PasswordCriteriaItem: React.FC<{ valid: boolean; text: string }> = ({ valid, text }) => (
    <div className={`flex items-center space-x-2 text-sm ${valid ? 'text-green-600' : 'text-gray-500'}`}>
      {valid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Music className="h-12 w-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Créer un compte</CardTitle>
          <CardDescription>
            Rejoignez SmartLinks et créez vos premiers liens musicaux
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Nom d'utilisateur</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choisissez un nom d'utilisateur"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className={errors.username ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.username && (
                <p className="text-sm text-red-500">{errors.username}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Entrez votre adresse email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Créez un mot de passe sécurisé"
                  value={formData.password}
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
              
              {/* Critères du mot de passe */}
              {formData.password && (
                <div className="space-y-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium text-gray-700">Critères du mot de passe :</p>
                  <PasswordCriteriaItem 
                    valid={passwordValidation.length} 
                    text="Au moins 8 caractères" 
                  />
                  <PasswordCriteriaItem 
                    valid={passwordValidation.letter} 
                    text="Au moins une lettre" 
                  />
                  <PasswordCriteriaItem 
                    valid={passwordValidation.number} 
                    text="Au moins un chiffre" 
                  />
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirmez votre mot de passe"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
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
                  Création du compte...
                </>
              ) : (
                'Créer mon compte'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            Déjà un compte ?{' '}
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Se connecter
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
