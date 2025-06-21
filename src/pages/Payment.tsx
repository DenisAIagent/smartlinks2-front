import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, CreditCard, Check, X, Music } from 'lucide-react';
import { toast } from 'sonner';

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string>('');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      checkSubscriptionStatus();
    }
  }, [sessionId]);

  const checkSubscriptionStatus = async () => {
    try {
      const response = await fetch('/api/payment/subscription-status', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSubscriptionStatus(data.subscription_status);
        
        if (data.subscription_status === 'active' || data.is_superadmin) {
          navigate('/', { replace: true });
        }
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
    }
  };

  const verifyPayment = async (sessionId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/payment/verify-session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          toast.success('Paiement confirmé ! Votre abonnement est maintenant actif.');
          navigate('/', { replace: true });
        } else {
          toast.info('Paiement en cours de traitement...');
        }
      } else {
        toast.error('Erreur lors de la vérification du paiement');
      }
    } catch (error) {
      toast.error('Erreur lors de la vérification du paiement');
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckoutSession = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/payment/create-checkout-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Rediriger vers Stripe Checkout
        window.location.href = data.checkout_url;
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Erreur lors de la création de la session de paiement');
      }
    } catch (error) {
      toast.error('Erreur lors de la création de la session de paiement');
    } finally {
      setIsLoading(false);
    }
  };

  if (sessionId && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
              <h2 className="text-xl font-semibold mb-2">Vérification du paiement...</h2>
              <p className="text-gray-600">Veuillez patienter pendant que nous vérifions votre paiement.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <Music className="h-16 w-16 text-blue-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Abonnement SmartLinks</h1>
          <p className="text-xl text-gray-600">Créez des liens musicaux intelligents sans limite</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Plan d'abonnement */}
          <Card className="relative">
            <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Recommandé
            </div>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Abonnement Annuel</CardTitle>
              <CardDescription>Accès complet pendant 12 mois</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-blue-600">500€</span>
                <span className="text-gray-600 ml-2">TTC / an</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Création illimitée de SmartLinks</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Personnalisation complète des pages</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Statistiques détaillées</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Support prioritaire</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>Domaine personnalisé</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span>API développeur</span>
                </div>
              </div>
              
              <Button 
                onClick={createCheckoutSession}
                disabled={isLoading}
                className="w-full mt-8 bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Redirection vers le paiement...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Souscrire maintenant
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Informations sur la sécurité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Check className="h-5 w-5 text-green-600 mr-2" />
                Paiement sécurisé
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Chiffrement SSL 256-bit</p>
                  <p className="text-sm text-gray-600">Vos données de paiement sont protégées</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Traitement par Stripe</p>
                  <p className="text-sm text-gray-600">Leader mondial des paiements en ligne</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Pas de données stockées</p>
                  <p className="text-sm text-gray-600">Nous ne stockons aucune information bancaire</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium">Conformité PCI DSS</p>
                  <p className="text-sm text-gray-600">Standards de sécurité les plus élevés</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Questions fréquentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium">Puis-je annuler mon abonnement à tout moment ?</h4>
              <p className="text-sm text-gray-600 mt-1">
                Oui, vous pouvez annuler votre abonnement à tout moment depuis votre tableau de bord. 
                Vous conserverez l'accès jusqu'à la fin de votre période payée.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Que se passe-t-il si j'annule ?</h4>
              <p className="text-sm text-gray-600 mt-1">
                Vos SmartLinks existants resteront accessibles, mais vous ne pourrez plus en créer de nouveaux 
                ou modifier les existants jusqu'au renouvellement de votre abonnement.
              </p>
            </div>
            <div>
              <h4 className="font-medium">Y a-t-il des frais cachés ?</h4>
              <p className="text-sm text-gray-600 mt-1">
                Non, le prix affiché de 500€ TTC par an inclut toutes les fonctionnalités et aucun frais supplémentaire.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="mr-4"
          >
            Retour à l'accueil
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
          >
            Accéder au tableau de bord
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
