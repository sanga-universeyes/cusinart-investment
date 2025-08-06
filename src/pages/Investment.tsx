import React, { useState } from 'react';
import { TrendingUp, Info } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CurrencySelector } from '../components/ui/CurrencySelector';
import { INVESTMENT_PLANS } from '../config/constants';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';

export function Investment() {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [selectedCurrency, setSelectedCurrency] = useState<'ar' | 'usdt'>('ar');
  const [investments, setInvestments] = useState<Record<string, number>>({});
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  if (!user) return null;

  const currentBalance = selectedCurrency === 'ar' ? user.balanceAr : user.balanceUsdt;

  const handleInvest = async (planId: string) => {
    const plan = INVESTMENT_PLANS.find(p => p.id === planId);
    if (!plan) return;

    const amount = parseFloat(amounts[planId] || '0');
    const currentInvestment = investments[planId] || 0;
    const minAmount = plan.minAmount[selectedCurrency];
    const maxAmount = plan.maxAmount[selectedCurrency];
    const minAddition = plan.minAddition[selectedCurrency];

    // Validations
    if (currentInvestment === 0 && amount < minAmount) {
      toast.error(`Investissement minimum: ${formatCurrency(minAmount, selectedCurrency)}`);
      return;
    }

    if (currentInvestment > 0 && amount < minAddition) {
      toast.error(`Ajout minimum: ${formatCurrency(minAddition, selectedCurrency)}`);
      return;
    }

    if (currentInvestment + amount > maxAmount) {
      toast.error(`Investissement maximum: ${formatCurrency(maxAmount, selectedCurrency)}`);
      return;
    }

    if (amount > currentBalance) {
      toast.error('Solde insuffisant');
      return;
    }

    try {
      // Débiter le solde
      const newBalance = selectedCurrency === 'ar' 
        ? { balanceAr: user.balanceAr - amount, isInvestor: true }
        : { balanceUsdt: user.balanceUsdt - amount, isInvestor: true };
      
      updateUser(newBalance);

      // Mettre à jour l'investissement
      setInvestments(prev => ({
        ...prev,
        [planId]: (prev[planId] || 0) + amount
      }));

      // Générer référence
      const txRef = `INV${Date.now().toString().slice(-6)}`;
      
      // Ajouter notification
      addNotification({
        type: 'investment',
        title: 'Investissement réussi',
        message: `Investissement de ${formatCurrency(amount, selectedCurrency)} sur ${plan.name}`,
        status: 'success',
        amount,
        currency: selectedCurrency,
        reference: txRef
      });

      toast.success(`Investissement dans ${plan.name} réussi !`);
      setAmounts(prev => ({ ...prev, [planId]: '' }));
      
    } catch (error) {
      toast.error('Erreur lors de l\'investissement');
    }
  };

  const getButtonText = (planId: string) => {
    const currentInvestment = investments[planId] || 0;
    const plan = INVESTMENT_PLANS.find(p => p.id === planId);
    if (!plan) return 'Investir';

    const maxAmount = plan.maxAmount[selectedCurrency];
    
    if (currentInvestment === 0) return 'Investir';
    if (currentInvestment >= maxAmount) return 'Terminé';
    return 'Ajouter';
  };

  const isMaxReached = (planId: string) => {
    const currentInvestment = investments[planId] || 0;
    const plan = INVESTMENT_PLANS.find(p => p.id === planId);
    if (!plan) return false;
    return currentInvestment >= plan.maxAmount[selectedCurrency];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Investissement</h1>
        <p className="text-gray-600">
          Solde disponible: {formatCurrency(currentBalance, selectedCurrency)}
        </p>
      </div>

      <div className="flex justify-end">
        <CurrencySelector 
          selected={selectedCurrency}
          onChange={setSelectedCurrency}
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {INVESTMENT_PLANS.map((plan) => {
          const currentInvestment = investments[plan.id] || 0;
          const maxReached = isMaxReached(plan.id);
          
          return (
            <Card key={plan.id} hover className="relative overflow-hidden">
              {/* Header avec image */}
              <div className="h-32 bg-gradient-to-br from-[#006B76] to-[#006B76]/80 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-[#006B76]">
                      {plan.id.slice(-1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>Revenu: <span className="font-semibold text-green-600">{plan.dailyReturn}%/jour</span></p>
                    <p>Commission parrainage: 10/6/3%</p>
                    <p>Commission équipe: 6/3/1%</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-600">Min:</span>
                      <span className="font-medium ml-1">
                        {formatCurrency(plan.minAmount[selectedCurrency], selectedCurrency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Max:</span>
                      <span className="font-medium ml-1">
                        {formatCurrency(plan.maxAmount[selectedCurrency], selectedCurrency)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <span className="text-gray-600">Ajout min:</span>
                    <span className="font-medium ml-1">
                      {formatCurrency(plan.minAddition[selectedCurrency], selectedCurrency)}
                    </span>
                  </div>
                </div>

                {currentInvestment > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <span className="font-medium">Investi:</span> {formatCurrency(currentInvestment, selectedCurrency)}
                    </p>
                  </div>
                )}

                <Input
                  label="Montant à investir"
                  type="number"
                  value={amounts[plan.id] || ''}
                  onChange={(e) => setAmounts(prev => ({ ...prev, [plan.id]: e.target.value }))}
                  placeholder={`Min: ${formatCurrency(currentInvestment === 0 ? plan.minAmount[selectedCurrency] : plan.minAddition[selectedCurrency], selectedCurrency)}`}
                  disabled={maxReached}
                />

                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleInvest(plan.id)}
                    className="flex-1"
                    disabled={maxReached || !amounts[plan.id] || parseFloat(amounts[plan.id] || '0') <= 0}
                    variant={maxReached ? 'secondary' : 'primary'}
                  >
                    {getButtonText(plan.id)}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAmounts(prev => ({ ...prev, [plan.id]: '' }))}
                    className="px-4"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Informations */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>💡 Comment ça marche:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Choisissez un plan selon votre budget</li>
              <li>Recevez des revenus quotidiens automatiques</li>
              <li>Gagnez des commissions sur vos filleuls</li>
              <li>Vous pouvez investir dans plusieurs plans</li>
              <li>Ajouts possibles jusqu'au montant maximum</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}