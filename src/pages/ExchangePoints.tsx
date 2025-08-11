import React, { useState } from 'react';
import { RefreshCw, Award, Wallet, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CurrencySelector } from '../components/ui/CurrencySelector';
import { formatCurrency, convertPointsToAr, convertPointsToUsdt } from '../utils/currency';
import toast from 'react-hot-toast';

export function ExchangePoints() {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [selectedCurrency, setSelectedCurrency] = useState<'ar' | 'usdt'>('ar');
  const [pointsAmount, setPointsAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const currentBalance = selectedCurrency === 'ar' ? user.balanceAr : user.balanceUsdt;
  
  // Taux de conversion selon le statut d'investisseur
  const conversionRate = user.isInvestor ? 100 : 10; // 100 Ar ou 10 Ar par point
  
  const calculateExchange = (points: number) => {
    if (selectedCurrency === 'ar') {
      return convertPointsToAr(points, user.isInvestor);
    } else {
      return convertPointsToUsdt(points, user.isInvestor);
    }
  };

  const handleExchange = async () => {
    const points = parseInt(pointsAmount);
    
    if (!points || points <= 0) {
      toast.error('Veuillez saisir un nombre de points valide');
      return;
    }

    if (points > user.pointsBalance) {
      toast.error('Points insuffisants');
      return;
    }

    if (points < 20) {
      toast.error('Minimum 20 points pour un échange');
      return;
    }

    try {
      setIsLoading(true);
      
      // Simuler l'échange
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const exchangeAmount = calculateExchange(points);
      
      // Débiter les points et créditer le solde
      const balanceUpdate = selectedCurrency === 'ar' 
        ? { balanceAr: user.balanceAr + exchangeAmount }
        : { balanceUsdt: user.balanceUsdt + exchangeAmount };
      
      updateUser({
        ...balanceUpdate,
        pointsBalance: user.pointsBalance - points
      });

      // Générer référence
      const txRef = `EPT${Date.now().toString().slice(-6)}`;
      
      // Ajouter notification
      addNotification({
        type: 'points_exchange',
        title: 'Échange de points',
        message: `Échange de ${points} points contre ${formatCurrency(exchangeAmount, selectedCurrency)}`,
        status: 'success',
        amount: exchangeAmount,
        currency: selectedCurrency,
        reference: txRef
      });

      toast.success(`${points} points échangés avec succès !`);
      setPointsAmount('');
      
    } catch (error) {
      toast.error('Erreur lors de l\'échange');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Échanger des Points</h1>
        <p className="text-gray-600">Convertissez vos points en argent</p>
      </div>

      {/* Soldes actuels */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="text-center">
          <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(user.pointsBalance, 'points')}
          </p>
          <p className="text-sm text-gray-600">Points disponibles</p>
        </Card>

        <Card className="text-center">
          <Wallet className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(currentBalance, selectedCurrency)}
          </p>
          <p className="text-sm text-gray-600">
            Solde {selectedCurrency === 'ar' ? 'Ariary' : 'USDT'}
          </p>
        </Card>
      </div>

      {/* Sélecteur de devise */}
      <div className="flex justify-end">
        <CurrencySelector 
          selected={selectedCurrency}
          onChange={setSelectedCurrency}
        />
      </div>

      {/* Taux de conversion */}
      <Card className={`${user.isInvestor ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
        <div className="text-center">
          <h3 className={`font-semibold mb-2 ${user.isInvestor ? 'text-green-900' : 'text-orange-900'}`}>
            Votre taux de conversion
          </h3>
          <p className={`text-2xl font-bold ${user.isInvestor ? 'text-green-800' : 'text-orange-800'}`}>
            1 point = {formatCurrency(conversionRate, 'ar')}
          </p>
          <p className={`text-sm mt-1 ${user.isInvestor ? 'text-green-700' : 'text-orange-700'}`}>
            {user.isInvestor ? 'Taux investisseur' : 'Taux non-investisseur'}
          </p>
        </div>
      </Card>

      {/* Formulaire d'échange */}
      <Card>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Échange de points</h3>
            <p className="text-sm text-gray-600">Minimum: 20 points</p>
          </div>

          <Input
            label="Nombre de points à échanger"
            type="number"
            value={pointsAmount}
            onChange={(e) => setPointsAmount(e.target.value)}
            placeholder="50"
            icon={<Award className="h-5 w-5" />}
          />

          {pointsAmount && parseInt(pointsAmount) > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-800">Points à échanger:</span>
                  <span className="font-semibold text-blue-900">
                    {formatCurrency(parseInt(pointsAmount), 'points')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">Vous recevrez:</span>
                  <span className="font-semibold text-blue-900">
                    {formatCurrency(calculateExchange(parseInt(pointsAmount)), selectedCurrency)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2">
                  <span className="text-blue-800">Nouveau solde:</span>
                  <span className="font-semibold text-blue-900">
                    {formatCurrency(currentBalance + calculateExchange(parseInt(pointsAmount)), selectedCurrency)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={handleExchange}
              className="flex-1"
              isLoading={isLoading}
              disabled={!pointsAmount || parseInt(pointsAmount) < 20 || parseInt(pointsAmount) > user.pointsBalance}
            >
              <RefreshCw className="mr-2 h-5 w-5" />
              Échanger
            </Button>
            <Button
              variant="outline"
              onClick={() => setPointsAmount('')}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>

          {/* Bouton pour créer des missions */}
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/tasks'}
              className="w-full"
            >
              Commander des missions
            </Button>
          </div>
        </div>
      </Card>

      {/* Informations */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>💡 Informations importantes :</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Minimum d'échange: 20 points</li>
              <li>Investisseurs: 1 point = 100 Ar</li>
              <li>Non-investisseurs: 1 point = 10 Ar</li>
              <li>Devenez investisseur pour un meilleur taux !</li>
              <li>L'échange est instantané et sans frais</li>
            </ul>
          </div>
        </div>
      </Card>

      {!user.isInvestor && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <h3 className="font-semibold text-yellow-900 mb-2">
              Améliorez votre taux de conversion !
            </h3>
            <p className="text-sm text-yellow-800 mb-4">
              Investissez dans un plan CUIZ pour obtenir un taux 10x meilleur
            </p>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/invest'}
              className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
            >
              Voir les plans d'investissement
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}