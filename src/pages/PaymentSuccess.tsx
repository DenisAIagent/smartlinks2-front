import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, Music, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const PaymentSuccess: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    } else {
      setIsVerifying(false);
      setVerificationStatus('error');
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const response = await fetch(`/api/payment/verify-session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setVerificationStatus('success');
          toast.success('Paiement confirmé ! Votre abonnement est maintenant actif.');
        } else {
          setVerificationStatus('pending');
        }
      } else {
        setVerificationStatus('error');
        toast.error('Erreur lors de la vérification du paiement');
      }
    } catch (error) {
      setVerificationStatus('error');
      toast.error('Erreur lors de la vérification du paiement');
    } finally {
      setIsVerifying(false);
    }
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
              <h2 className="text-xl font-semibold mb-2">Vérification en cours...</h2>
              <p className="text-gray-600">Nous vérifions votre paiement, veuillez patienter.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                <Music className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-xl text-red-600">Erreur de vérification</CardTitle>
            <CardDescription>
              Une erreur s'est produite lors de la vérification de votre paiement.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 text-center">
              Veuillez contacter notre support si le problème persiste.
            </p>
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => navigate('/payment')}
                className="flex-1"
              >
                Retour au paiement
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Accueil
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-green-600">Paiement réussi !</CardTitle>
          <CardDescription>
            Votre abonnement SmartLinks est maintenant actif
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-700">
              Félicitations ! Votre abonnement annuel à SmartLinks a été activé avec succès.
            </p>
            <p className="text-sm text-gray-600">
              Vous pouvez maintenant créer des liens musicaux intelligents sans limite.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Ce qui vous attend :</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Création illimitée de SmartLinks</li>
              <li>• Personnalisation complète des pages</li>
              <li>• Statistiques détaillées</li>
              <li>• Support prioritaire</li>
            </ul>
          </div>

          <div className="flex space-x-3">
            <Button 
              onClick={() => navigate('/create')}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              Créer mon premier lien
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Tableau de bord
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Un email de confirmation vous a été envoyé
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
