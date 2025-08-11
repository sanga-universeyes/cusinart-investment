import React, { useState } from 'react';
import { TrendingUp, DollarSign, Percent, Info, CheckCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { INVESTMENT_PLANS } from '../config/constants';
import { formatCurrency } from '../utils/currency';

export function Investment() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [amountAr, setAmountAr] = useState('');

  const selectedPlan = INVESTMENT_PLANS.find(p => p.id === selectedPlanId) || null;

  const canInvest = selectedPlan && amountAr && Number(amountAr) >= selectedPlan.minAmount.ar && Number(amountAr) <= selectedPlan.maxAmount.ar;

  return (
    <div className="w-full space-y-6 pb-24 lg:pb-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Investissement</h1>
        <p className="text-gray-600">Choisissez un plan et commencez à gagner des revenus quotidiens</p>
      </div>

      <Card>
        <div className="grid md:grid-cols-3 gap-6">
          {INVESTMENT_PLANS.map(plan => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`text-left p-4 border rounded-lg transition-all hover:shadow-md ${
                selectedPlanId === plan.id ? 'border-[#006B76]' : 'border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-[#006B76]" />
                  <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                </div>
                <span className="inline-flex items-center text-sm text-[#006B76]">
                  <Percent className="h-4 w-4 mr-1" />
                  {plan.dailyReturn}%/jour
                </span>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <p>Min: {formatCurrency(plan.minAmount.ar, 'ar')} • Max: {formatCurrency(plan.maxAmount.ar, 'ar')}</p>
                <p>Ajout min: {formatCurrency(plan.minAddition.ar, 'ar')}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <DollarSign className="h-5 w-5 mr-2" />
          Montant d'investissement (Ar)
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              type="number"
              value={amountAr}
              onChange={(e) => setAmountAr(e.target.value)}
              placeholder={selectedPlan ? String(selectedPlan.minAmount.ar) : 'Montant en Ariary'}
              disabled={!selectedPlan}
            />
          </div>
          <Button
            size="lg"
            disabled={!canInvest}
            className="w-full"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Investir maintenant
          </Button>
        </div>
        {selectedPlan && (
          <div className="mt-4 text-sm text-gray-600 flex items-start">
            <Info className="h-4 w-4 mr-2 mt-0.5 text-blue-600" />
            <p>
              Plage autorisée pour {selectedPlan.name}: {formatCurrency(selectedPlan.minAmount.ar, 'ar')} à {formatCurrency(selectedPlan.maxAmount.ar, 'ar')} • Rendement quotidien: {selectedPlan.dailyReturn}%
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default Investment;