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
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const agents = DEFAULT_AGENTS;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
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
    <div className="w-full space-y-6 pb-24 lg:pb-6">
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
        <h3 className="font-semibold text-gray-900 text-center md:text-left">
          Nos agents financiers
        </h3>
        {agents.map((agent) => (
          <Card key={agent.id} className="p-4 hover:shadow-lg transition-all" hover>
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-medium text-gray-900 text-sm md:text-base">
                    {agent.phone}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(agent.phone, 'Numéro')}
                    className="p-2"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm md:text-base text-gray-600 font-medium">{agent.name}</p>
                <p className="text-xs md:text-sm text-gray-500 uppercase font-medium">
                  {agent.method === 'mvola' ? 'MVola' :
                   agent.method === 'airtel' ? 'Airtel Money' :
                   agent.method === 'orange' ? 'Orange Money' : 'USDT TRC20'}
                </p>
              </div>
              {agent.method !== 'usdt' && (
                <div className="w-12 h-8 md:w-14 md:h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs md:text-sm font-bold">
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
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Formulaire de Dépôt
            </h3>
            <p className="text-sm text-gray-600">
              Remplissez tous les champs pour valider votre dépôt
            </p>
          </div>

          <Input
            label={`Montant à transférer (${selectedCurrency.toUpperCase()})`}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={selectedCurrency === 'ar' ? '10000' : '2'}
            className="text-lg font-semibold"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preuve de paiement
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#006B76] transition-colors bg-gray-50 hover:bg-gray-100">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="proof-upload"
              />
              <label htmlFor="proof-upload" className="cursor-pointer">
                {proofImage && previewImage ? (
                  <div className="space-y-3">
                    <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border border-green-200">
                      <img 
                        src={previewImage} 
                        alt="Preuve" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <Check className="h-5 w-5" />
                      <span className="font-medium">Image ajoutée: {proofImage.name}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                    <p className="text-base font-medium text-gray-600">
                      Cliquer pour téléverser la capture de facture
                    </p>
                    <p className="text-sm text-gray-500">
                      PNG, JPG jusqu'à 5MB
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
            className="font-mono"
            required
          />

          <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
            <Button
              type="submit"
              className="flex-1"
              size="lg"
              isLoading={isSubmitting}
              disabled={!amount || !proofImage || !reference}
            >
              <Check className="mr-2 h-5 w-5" />
              Déposer
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              size="lg"
              onClick={() => {
                setAmount('');
                setProofImage(null);
                setPreviewImage(null);
                setReference('');
              }}
            >
              <X className="mr-2 h-5 w-5" />
              Annuler
            </Button>
          </div>
        </form>
      </Card>

      {/* Informations */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="space-y-3 text-sm text-blue-800">
          <p className="font-semibold text-blue-900 flex items-center">
            <span className="text-lg mr-2">💡</span>
            Instructions de Dépôt
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4">
            <li>Effectuez le transfert vers l'un des numéros ci-dessus</li>
            <li>Prenez une capture d'écran de la confirmation SMS</li>
            <li>Téléversez la preuve et saisissez la référence</li>
            <li>Votre solde sera crédité sous 1-6h après validation</li>
            <li>Minimum: {selectedCurrency === 'ar' ? '10,000 Ar' : '2 USDT'}</li>
            <li>Aucun frais de dépôt</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}