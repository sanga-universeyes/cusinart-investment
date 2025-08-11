import React, { useState } from 'react';
import { Award, ShoppingCart, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CurrencySelector } from '../components/ui/CurrencySelector';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';

export function BuyPoints() {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [selectedCurrency, setSelectedCurrency] = useState<'ar' | 'usdt'>('ar');
  const [pointsAmount, setPointsAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const currentBalance = selectedCurrency === 'ar' ? user.balanceAr : user.balanceUsdt;
  const pointCostAr = 100; // 1 point = 100 Ar
  const pointCostUsdt = 0.02; // 1 point = 0.02 USDT

  const calculateCost = (points: number) => {
    return selectedCurrency === 'ar' 
      ? points * pointCostAr 
      : points * pointCostUsdt;
  };

  const handlePurchase = async () => {
    const points = parseInt(pointsAmount);
    
    if (!points || points <= 0) {
      toast.error('Veuillez saisir un nombre de points valide');
      return;
    }

    const totalCost = calculateCost(points);
    
    if (totalCost > currentBalance) {
      toast.error('Solde insuffisant');
      return;
    }

    try {
      setIsLoading(true);
      
      // Simuler l'achat
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Débiter le solde et créditer les points
      const balanceUpdate = selectedCurrency === 'ar' 
        ? { balanceAr: user.balanceAr - totalCost }
        : { balanceUsdt: user.balanceUsdt - totalCost };
      
      updateUser({
        ...balanceUpdate,
        pointsBalance: user.pointsBalance + points
      });

      // Générer référence
      const txRef = `BPT${Date.now().toString().slice(-6)}`;
      
      // Ajouter notification
      addNotification({
        type: 'points_purchase',
        title: 'Achat de points',
        message: `Achat de ${points} points pour ${formatCurrency(totalCost, selectedCurrency)}`,
        status: 'success',
        amount: points,
        currency: 'points',
        reference: txRef
      });

      toast.success(`${points} points achetés avec succès !`);
      setPointsAmount('');
      
    } catch (error) {
      toast.error('Erreur lors de l\'achat');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Acheter des Points</h1>
        <p className="text-gray-600">Convertissez votre argent en points pour créer des missions</p>
      </div>

      {/* Soldes actuels */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="text-center">
          <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(user.pointsBalance, 'points')}
          </p>
          <p className="text-sm text-gray-600">Points actuels</p>
        </Card>

        <Card className="text-center">
          <ShoppingCart className="h-8 w-8 text-blue-500 mx-auto mb-2" />
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

      {/* Formulaire d'achat */}
      <Card>
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Achat de points</h3>
            <p className="text-sm text-gray-600">
              Taux: 1 point = {formatCurrency(selectedCurrency === 'ar' ? pointCostAr : pointCostUsdt, selectedCurrency)}
            </p>
          </div>

          <Input
            label="Nombre de points à acheter"
            type="number"
            value={pointsAmount}
            onChange={(e) => setPointsAmount(e.target.value)}
            placeholder="100"
            icon={<Award className="h-5 w-5" />}
          />

          {pointsAmount && parseInt(pointsAmount) > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-800">Points à acheter:</span>
                  <span className="font-semibold text-blue-900">
                    {formatCurrency(parseInt(pointsAmount), 'points')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-800">Coût total:</span>
                  <span className="font-semibold text-blue-900">
                    {formatCurrency(calculateCost(parseInt(pointsAmount)), selectedCurrency)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2">
                  <span className="text-blue-800">Solde après achat:</span>
                  <span className="font-semibold text-blue-900">
                    {formatCurrency(currentBalance - calculateCost(parseInt(pointsAmount)), selectedCurrency)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={handlePurchase}
              className="flex-1"
              isLoading={isLoading}
              disabled={!pointsAmount || parseInt(pointsAmount) <= 0 || calculateCost(parseInt(pointsAmount || '0')) > currentBalance}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Acheter
            </Button>
            <Button
              variant="outline"
              onClick={() => setPointsAmount('')}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </div>
      </Card>

      {/* Informations sur l'utilisation des points */}
      <Card className="bg-yellow-50 border-yellow-200">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="space-y-2 text-sm text-yellow-800">
            <p><strong>💡 À quoi servent les points ?</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Créer des missions rémunérées (likes, abonnements, etc.)</li>
              <li>Chaque point = 1 mission à faire exécuter</li>
              <li>Plus vous achetez de points, plus vous pouvez créer de missions</li>
              <li>Les points non utilisés restent dans votre solde</li>
              <li>Vous pouvez aussi échanger vos points contre de l'argent</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Bouton vers les missions */}
      <div className="text-center">
        <Button
          variant="outline"
          onClick={() => window.location.href = '/tasks'}
          className="w-full"
        >
          Commander des missions
        </Button>
      </div>
    </div>
  );
}