import React, { useState } from 'react';
import { Copy, Camera, Upload, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CurrencySelector } from '../components/ui/CurrencySelector';
import { DEFAULT_AGENTS } from '../config/constants';
import { formatCurrency, validateAmount } from '../utils/currency';
import toast from 'react-hot-toast';

export function Deposit() {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [selectedCurrency, setSelectedCurrency] = useState<'ar' | 'usdt'>('ar');
  const [amount, setAmount] = useState('');
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [reference, setReference] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const agents = DEFAULT_AGENTS;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofImage(file);
      toast.success('Image ajoutée !');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !proofImage || !reference) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    const numAmount = parseFloat(amount);
    if (!validateAmount(numAmount, 'deposit', selectedCurrency)) {
      const minAmount = selectedCurrency === 'ar' ? '10,000 Ar' : '2 USDT';
      toast.error(`Montant minimum: ${minAmount}`);
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Simuler l'envoi
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Générer une référence de transaction
      const txRef = `DEP${Date.now().toString().slice(-6)}`;
      
      // Ajouter notification
      addNotification({
        type: 'deposit',
        title: 'Demande de dépôt',
        message: `Dépôt de ${formatCurrency(numAmount, selectedCurrency)} en attente de validation`,
        status: 'pending',
        amount: numAmount,
        currency: selectedCurrency,
        reference: txRef
      });

      toast.success('Demande de dépôt envoyée !');
      
      // Reset form
      setAmount('');
      setProofImage(null);
      setReference('');
      
    } catch (error) {
      toast.error('Erreur lors de l\'envoi');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dépôt</h1>
        <p className="text-gray-600">Transférer l'argent à nos agents financiers</p>
      </div>

      <div className="flex justify-end">
        <CurrencySelector 
          selected={selectedCurrency}
          onChange={setSelectedCurrency}
        />
      </div>

      {/* Agents */}
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900">Nos agents financiers</h3>
        {agents.map((agent) => (
          <Card key={agent.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{agent.phone}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(agent.phone, 'Numéro')}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-gray-600">{agent.name}</p>
                <p className="text-xs text-gray-500 uppercase">
                  {agent.method === 'mvola' ? 'MVola' :
                   agent.method === 'airtel' ? 'Airtel Money' :
                   agent.method === 'orange' ? 'Orange Money' : 'USDT TRC20'}
                </p>
              </div>
              {agent.method !== 'usdt' && (
                <div className="w-12 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {agent.method === 'mvola' ? 'M' :
                     agent.method === 'airtel' ? 'A' : 'O'}
                  </span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Formulaire */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={`Montant à transférer (${selectedCurrency.toUpperCase()})`}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={selectedCurrency === 'ar' ? '10000' : '2'}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preuve de paiement
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="proof-upload"
              />
              <label htmlFor="proof-upload" className="cursor-pointer">
                {proofImage ? (
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span>Image ajoutée: {proofImage.name}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="h-8 w-8 text-gray-400 mx-auto" />
                    <p className="text-sm text-gray-600">
                      Cliquer pour téléverser la capture de facture
                    </p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <Input
            label="Référence de la facture"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Coller ou saisir la référence ID"
            required
          />

          <div className="flex space-x-4">
            <Button
              type="submit"
              className="flex-1"
              isLoading={isSubmitting}
              disabled={!amount || !proofImage || !reference}
            >
              Déposer
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                setAmount('');
                setProofImage(null);
                setReference('');
              }}
            >
              Annuler
            </Button>
          </div>
        </form>
      </Card>

      {/* Informations */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>💡 Instructions:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Effectuez le transfert vers l'un des numéros ci-dessus</li>
            <li>Prenez une capture d'écran de la confirmation SMS</li>
            <li>Téléversez la preuve et saisissez la référence</li>
            <li>Votre solde sera crédité sous 1-6h après validation</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}