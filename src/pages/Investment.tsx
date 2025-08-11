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
    <div className="max-w-4xl mx-auto space-y-6 pb-24 lg:pb-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Investissement</h1>
        <p className="text-gray-600">
          Solde disponible: <span className="font-bold text-[#006B76]">{formatCurrency(currentBalance, selectedCurrency)}</span>
        </p>
      </div>

      <div className="flex justify-center md:justify-end">
        <CurrencySelector 
          selected={selectedCurrency}
          onChange={setSelectedCurrency}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {INVESTMENT_PLANS.map((plan) => {
          const currentInvestment = investments[plan.id] || 0;
          const maxReached = isMaxReached(plan.id);
          
          return (
            <Card key={plan.id} hover className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50">
              {/* Header avec image */}
              <div className="h-32 md:h-40 bg-gradient-to-br from-[#006B76] to-[#006B76]/80 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <TrendingUp className="h-8 w-8 md:h-10 md:w-10 text-white" />
                  </div>
                </div>
                <div className="absolute top-3 left-3 md:top-4 md:left-4">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm md:text-base font-bold text-[#006B76]">
                      {plan.id.slice(-1)}
                    </span>
                  </div>
                </div>
                {maxReached && (
                  <div className="absolute top-3 right-3 md:top-4 md:right-4">
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      TERMINÉ
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 md:p-6 space-y-4">
                <div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center justify-between bg-green-50 p-2 rounded-lg">
                      <span>Revenu quotidien:</span>
                      <span className="font-bold text-green-600 text-lg">{plan.dailyReturn}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-blue-50 p-2 rounded text-center">
                        <p className="font-medium text-blue-800">Parrainage</p>
                        <p className="text-blue-600">10/6/3%</p>
                      </div>
                      <div className="bg-purple-50 p-2 rounded text-center">
                        <p className="font-medium text-purple-800">Équipe</p>
                        <p className="text-purple-600">6/3/1%</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <span className="text-gray-600 block">Minimum:</span>
                      <span className="font-bold text-gray-900">
                        {formatCurrency(plan.minAmount[selectedCurrency], selectedCurrency)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Maximum:</span>
                      <span className="font-bold text-gray-900">
                        {formatCurrency(plan.maxAmount[selectedCurrency], selectedCurrency)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <span className="text-gray-600 block">Ajout minimum:</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(plan.minAddition[selectedCurrency], selectedCurrency)}
                    </span>
                  </div>
                </div>

                {currentInvestment > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                    <div className="text-center">
                      <p className="text-sm font-medium text-blue-800 mb-1">Déjà investi</p>
                      <p className="text-lg font-bold text-blue-900">
                        {formatCurrency(currentInvestment, selectedCurrency)}
                      </p>
                      <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all" 
                          style={{ width: `${(currentInvestment / plan.maxAmount[selectedCurrency]) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                <Input
                  label="Montant à investir"
                  type="number"
                  value={amounts[plan.id] || ''}
                  onChange={(e) => setAmounts(prev => ({ ...prev, [plan.id]: e.target.value }))}
                  placeholder={`Min: ${formatCurrency(currentInvestment === 0 ? plan.minAmount[selectedCurrency] : plan.minAddition[selectedCurrency], selectedCurrency)}`}
                  disabled={maxReached}
                  className="text-lg font-semibold text-center"
                />

                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3">
                  <Button
                    onClick={() => handleInvest(plan.id)}
                    className="flex-1"
                    size="lg"
                    disabled={maxReached || !amounts[plan.id] || parseFloat(amounts[plan.id] || '0') <= 0}
                    variant={maxReached ? 'secondary' : 'primary'}
                  >
                    {maxReached ? (
                      <>
                        <Check className="mr-2 h-5 w-5" />
                        Terminé
                      </>
                    ) : currentInvestment > 0 ? (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Ajouter
                      </>
                    ) : (
                      <>
                        <TrendingUp className="mr-2 h-5 w-5" />
                        Investir
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAmounts(prev => ({ ...prev, [plan.id]: '' }))}
                    className="md:px-6"
                    size="lg"
                  >
                    <X className="mr-2 h-4 w-4" />
                    <span className="hidden md:inline">Annuler</span>
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Informations */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-start space-x-3">
          <Info className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div className="space-y-3 text-sm text-blue-800">
            <p className="font-semibold text-blue-900 text-base">💡 Comment ça marche</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Choisissez un plan selon votre budget</li>
              <li>Recevez des revenus quotidiens automatiques</li>
              <li>Gagnez des commissions sur vos filleuls</li>
              <li>Vous pouvez investir dans plusieurs plans</li>
              <li>Ajouts possibles jusqu'au montant maximum</li>
              <li>Commissions versées automatiquement</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Calculateur de revenus */}
      <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
        <div className="text-center">
          <h3 className="font-semibold text-green-900 mb-4 text-lg">
            📈 Simulateur de Revenus
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Investissement total</p>
              <p className="text-xl font-bold text-gray-900">
                {formatCurrency(totalInvested, selectedCurrency)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Revenus quotidiens</p>
              <p className="text-xl font-bold text-green-600">
                {formatCurrency(totalInvested * 0.035, selectedCurrency)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <p className="text-sm text-gray-600 mb-1">Revenus mensuels</p>
              <p className="text-xl font-bold text-green-700">
                {formatCurrency(totalInvested * 0.035 * 30, selectedCurrency)}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
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