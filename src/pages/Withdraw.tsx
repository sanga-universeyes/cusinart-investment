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
    <div className="max-w-2xl mx-auto space-y-6 pb-24 lg:pb-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Retrait</h1>
        <p className="text-gray-600">
          Solde actuel: <span className="font-bold text-[#006B76]">{formatCurrency(currentBalance, selectedCurrency)}</span>
        </p>
      </div>

      <div className="flex justify-center md:justify-end">
        <CurrencySelector 
          selected={selectedCurrency}
          onChange={setSelectedCurrency}
        />
      </div>

      <Card>
        {step === 'amount' && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Demande de Retrait
              </h3>
              <p className="text-sm text-gray-600">
                Minimum: {formatCurrency(minAmount, selectedCurrency)} • Frais: 10%
              </p>
            </div>

            <Input
              label="Montant à retirer"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={selectedCurrency === 'ar' ? '4800' : '1'}
              className="text-lg font-semibold text-center"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Méthode de retrait
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { value: 'mvola', label: '📱 MVola', color: 'from-orange-400 to-orange-500' },
                  { value: 'airtel', label: '📱 Airtel Money', color: 'from-red-400 to-red-500' },
                  { value: 'orange', label: '📱 Orange Money', color: 'from-orange-500 to-yellow-500' },
                  { value: 'usdt', label: '₿ USDT TRC20', color: 'from-green-400 to-green-500' }
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMethod(option.value as any)}
                    className={`p-4 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      method === option.value
                        ? `border-[#006B76] bg-gradient-to-r ${option.color} text-white shadow-lg transform scale-105`
                        : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:shadow-md'
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
              className={method === 'usdt' ? 'font-mono text-sm' : ''}
            />

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <Button
                onClick={handleAmountValidation}
                className="flex-1"
                size="lg"
                disabled={!amount || !recipient}
              >
                Valider le montant
              </Button>
            </div>
          </div>
        )}

        {step === 'confirm' && calculatedAmount && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-yellow-900 text-lg">Récapitulatif du retrait</h3>
                  <div className="text-sm text-yellow-800 space-y-2 bg-white/50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span>Montant demandé:</span>
                      <span className="font-semibold">{formatCurrency(parseFloat(amount), selectedCurrency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frais (10%):</span>
                      <span className="font-semibold text-red-700">-{formatCurrency(calculatedAmount.fee, selectedCurrency)}</span>
                    </div>
                    <div className="flex justify-between border-t border-yellow-300 pt-2">
                      <span className="font-bold">Montant à recevoir:</span>
                      <span className="font-bold text-green-700 text-lg">{formatCurrency(calculatedAmount.net, selectedCurrency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Méthode:</span>
                      <span className="font-medium">
                        {method === 'mvola' ? '📱 MVola' : 
                         method === 'airtel' ? '📱 Airtel Money' : 
                         method === 'orange' ? '📱 Orange Money' : '₿ USDT TRC20'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Destinataire:</span>
                      <span className="font-mono text-sm">{recipient}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <Button
                onClick={handleConfirm}
                className="flex-1"
                size="lg"
              >
                <Check className="mr-2 h-5 w-5" />
                Confirmer le retrait
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep('amount')}
                className="flex-1"
                size="lg"
              >
                <X className="mr-2 h-5 w-5" />
                Annuler
              </Button>
            </div>
          </div>
        )}

        {step === 'password' && (
          <div className="space-y-6">
            <div className="text-center bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
              <div className="w-16 h-16 bg-gradient-to-br from-[#006B76] to-[#006B76]/80 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
                <Lock className="h-8 w-8 text-white" />
              </div>
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
              className="text-center text-lg"
            />

            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
              <Button
                onClick={handleSubmit}
                className="flex-1"
                size="lg"
                isLoading={isSubmitting}
                disabled={!withdrawPassword}
              >
                <Check className="mr-2 h-5 w-5" />
                Valider
              </Button>
              <Button
                variant="outline"
                onClick={() => setStep('confirm')}
                className="flex-1"
                size="lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Informations */}
      <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
        <div className="space-y-3 text-sm text-red-800">
          <p className="font-semibold text-red-900 flex items-center">
            <span className="text-lg mr-2">⚠️</span>
            Informations Importantes
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Minimum de retrait: {formatCurrency(minAmount, selectedCurrency)}</li>
            <li>Frais de retrait: 10% du montant</li>
            <li>Délai de traitement: 12h maximum</li>
            <li>Retraits disponibles 5j/7 (24h/24)</li>
            <li>Votre solde sera débité immédiatement</li>
            <li>Mot de passe de retrait obligatoire</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}