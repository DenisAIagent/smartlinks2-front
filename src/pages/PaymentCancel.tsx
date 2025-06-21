import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { XCircle, Music, ArrowLeft, CreditCard } from 'lucide-react';

const PaymentCancel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-gray-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-gray-700">Paiement annulé</CardTitle>
          <CardDescription>
            Votre processus de paiement a été interrompu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-gray-700">
              Aucun frais n'a été prélevé. Vous pouvez reprendre le processus de paiement à tout moment.
            </p>
            <p className="text-sm text-gray-600">
              Votre compte reste actif mais l'accès aux fonctionnalités premium nécessite un abonnement.
            </p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-medium text-yellow-800 mb-2">Pourquoi s'abonner ?</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Créez des liens musicaux sans limite</li>
              <li>• Personnalisez vos pages de destination</li>
              <li>• Accédez aux statistiques avancées</li>
              <li>• Bénéficiez du support prioritaire</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={() => navigate('/payment')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              Reprendre le paiement
            </Button>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Tableau de bord
              </Button>
              <Button 
                variant="ghost"
                onClick={() => navigate('/login')}
                className="flex-1"
              >
                Se déconnecter
              </Button>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Besoin d'aide ? Contactez notre support
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;
