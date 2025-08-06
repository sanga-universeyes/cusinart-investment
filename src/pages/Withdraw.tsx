import React, { useState } from 'react';
import { Lock, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CurrencySelector } from '../components/ui/CurrencySelector';
import { formatCurrency, calculateWithdrawalAmount, validateAmount } from '../utils/currency';
import { EXCHANGE_RATES } from '../config/constants';
import toast from 'react-hot-toast';

export function Withdraw() {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [selectedCurrency, setSelectedCurrency] = useState<'ar' | 'usdt'>('ar');
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'mvola' | 'airtel' | 'orange' | 'usdt'>('mvola');
  const [recipient, setRecipient] = useState('');
  const [withdrawPassword, setWithdrawPassword] = useState('');
  const [step, setStep] = useState<'amount' | 'confirm' | 'password'>('amount');
  const [calculatedAmount, setCalculatedAmount] = useState<{ net: number; fee: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!user) return null;

  const currentBalance = selectedCurrency === 'ar' ? user.balanceAr : user.balanceUsdt;
  const minAmount = selectedCurrency === 'ar' ? EXCHANGE_RATES.MIN_WITHDRAWAL_AR : EXCHANGE_RATES.MIN_WITHDRAWAL_USDT;

  const handleAmountValidation = () => {
    const numAmount = parseFloat(amount);
    
    if (!numAmount || numAmount <= 0) {
      toast.error('Montant invalide');
      return;
    }

    if (!validateAmount(numAmount, 'withdrawal', selectedCurrency)) {
      toast.error(`Montant minimum: ${formatCurrency(minAmount, selectedCurrency)}`);
      return;
    }

    if (numAmount > currentBalance) {
      toast.error('Solde insuffisant');
      return;
    }

    const calculated = calculateWithdrawalAmount(numAmount);
    setCalculatedAmount(calculated);
    setStep('confirm');
  };

  const handleConfirm = () => {
    if (!recipient) {
      toast.error('Veuillez saisir le destinataire');
      return;
    }
    setStep('password');
  };

  const handleSubmit = async () => {
    if (!withdrawPassword) {
      toast.error('Mot de passe de retrait requis');
      return;
    }

    if (!calculatedAmount) return;

    try {
      setIsSubmitting(true);
      
      // Simuler la vérification du mot de passe
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Débiter le solde
      const totalAmount = parseFloat(amount);
      const newBalance = selectedCurrency === 'ar' 
        ? { balanceAr: user.balanceAr - totalAmount }
        : { balanceUsdt: user.balanceUsdt - totalAmount };
      
      updateUser(newBalance);
      
      // Générer référence
      const txRef = `WTH${Date.now().toString().slice(-6)}`;
      
      // Ajouter notification
      addNotification({
        type: 'withdrawal',
        title: 'Demande de retrait',
        message: `Retrait de ${formatCurrency(calculatedAmount.net, selectedCurrency)} en attente de validation`,
        status: 'pending',
        amount: calculatedAmount.net,
        currency: selectedCurrency,
        reference: txRef
      });

      toast.success('Demande de retrait envoyée !');
      
      // Reset
      setAmount('');
      setRecipient('');
      setWithdrawPassword('');
      setStep('amount');
      setCalculatedAmount(null);
      
    } catch (error) {
      toast.error('Erreur lors du retrait');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Retrait</h1>
        <p className="text-gray-600">
          Solde actuel: {formatCurrency(currentBalance, selectedCurrency)}
        </p>
      </div>

      <div className="flex justify-end">
        <CurrencySelector 
          selected={selectedCurrency}
          onChange={setSelectedCurrency}
        />
      </div>

      <Card>
        {step === 'amount' && (
          <div className="space-y-6">
            <Input
              label="Montant à retirer"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={selectedCurrency === 'ar' ? '4800' : '1'}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Méthode de retrait
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'mvola', label: 'MVola' },
                  { value: 'airtel', label: 'Airtel Money' },
                  { value: 'orange', label: 'Orange Money' },
                  { value: 'usdt', label: 'USDT TRC20' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMethod(option.value as any)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      method === option.value
                        ? 'border-[#006B76] bg-[#006B76]/10 text-[#006B76]'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <Input
              label={method === 'usdt' ? 'Adresse portefeuille USDT TRC20' : 'Numéro de téléphone'}
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder={method === 'usdt' ? 'TLuPRrRJGWhBAenUwHY7LbR2pxwW8rAhtn' : '032 XX XXX XX'}
            />

            <Button
              onClick={handleAmountValidation}
              className="w-full"
              disabled={!amount || !recipient}
            >
              Valider le montant
            </Button>
          </div>
        )}

        {step === 'confirm' && calculatedAmount && (
          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-medium text-yellow-800">Récapitulatif du retrait</h3>
                  <div className="text-sm text-yellow-700 space-y-1">
                    <p>Montant demandé: {formatCurrency(parseFloat(amount), selectedCurrency)}</p>
                    <p>Frais (10%): {formatCurrency(calculatedAmount.fee, selectedCurrency)}</p>
                    <p className="font-semibold">Montant à recevoir: {formatCurrency(calculatedAmount.net, selectedCurrency)}</p>
                    <p>Méthode: {method === 'mvola' ? 'MVola' : method === 'airtel' ? 'Airtel Money' : method === 'orange' ? 'Orange Money' : 'USDT TRC20'}</p>
                    <p>Destinataire: {recipient}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                onClick={handleConfirm}
                className="flex-1"
              >
                Confirmer le retrait
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep('amount')}
                className="flex-1"
              >
                Annuler
              </Button>
            </div>
          </div>
        )}

        {step === 'password' && (
          <div className="space-y-6">
            <div className="text-center">
              <Lock className="h-12 w-12 text-[#006B76] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Confirmation sécurisée
              </h3>
              <p className="text-gray-600">
                Saisissez votre mot de passe de retrait pour finaliser
              </p>
            </div>

            <Input
              label="Mot de passe de retrait"
              type="password"
              value={withdrawPassword}
              onChange={(e) => setWithdrawPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="h-5 w-5" />}
            />

            <div className="flex space-x-4">
              <Button
                onClick={handleSubmit}
                className="flex-1"
                isLoading={isSubmitting}
                disabled={!withdrawPassword}
              >
                Valider
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep('confirm')}
                className="flex-1"
              >
                Retour
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Informations */}
      <Card className="bg-red-50 border-red-200">
        <div className="space-y-2 text-sm text-red-800">
          <p><strong>⚠️ Important:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Minimum de retrait: {formatCurrency(minAmount, selectedCurrency)}</li>
            <li>Frais de retrait: 10% du montant</li>
            <li>Délai de traitement: 12h maximum</li>
            <li>Retraits disponibles 5j/7 (24h/24)</li>
            <li>Votre solde sera débité immédiatement</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}