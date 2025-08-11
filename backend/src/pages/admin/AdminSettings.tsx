import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw, 
  DollarSign, 
  Shield, 
  Bell,
  Globe,
  Sliders
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { SystemSettings } from '../../types/admin';
import toast from 'react-hot-toast';

export function AdminSettings() {
  const { settings, updateSettings } = useAdmin();
  const [formData, setFormData] = useState<SystemSettings>(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'rates' | 'limits' | 'validation' | 'notifications'>('general');

  const handleSave = async () => {
    try {
      await updateSettings(formData);
      toast.success('Paramètres mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleReset = () => {
    setFormData(settings);
    toast.info('Paramètres réinitialisés');
  };

  const tabs = [
    { key: 'general', label: 'Général', icon: Settings },
    { key: 'rates', label: 'Taux de change', icon: RefreshCw },
    { key: 'limits', label: 'Limites', icon: Sliders },
    { key: 'validation', label: 'Validation', icon: Shield },
    { key: 'notifications', label: 'Notifications', icon: Bell }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Paramètres Système</h1>
        <p className="text-gray-600">Configuration globale de la plateforme</p>
      </div>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#006B76] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeTab === 'general' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Settings className="inline mr-2 h-5 w-5" />
                Paramètres Généraux
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Devises acceptées</h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.currencies.ar}
                        onChange={(e) => setFormData({
                          ...formData,
                          currencies: { ...formData.currencies, ar: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      Ariary (Ar) - Devise locale
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.currencies.usdt}
                        onChange={(e) => setFormData({
                          ...formData,
                          currencies: { ...formData.currencies, usdt: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      USDT TRC20 - Cryptomonnaie
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'rates' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <RefreshCw className="inline mr-2 h-5 w-5" />
                Taux de Change
              </h3>
              
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    label="1 USDT = ? Ar"
                    type="number"
                    value={formData.exchangeRates.usdtToAr}
                    onChange={(e) => setFormData({
                      ...formData,
                      exchangeRates: {
                        ...formData.exchangeRates,
                        usdtToAr: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                  
                  <Input
                    label="1 Ar = ? USDT"
                    type="number"
                    step="0.0001"
                    value={formData.exchangeRates.arToUsdt}
                    onChange={(e) => setFormData({
                      ...formData,
                      exchangeRates: {
                        ...formData.exchangeRates,
                        arToUsdt: parseFloat(e.target.value) || 0
                      }
                    })}
                  />
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Conversion des Points</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="1 Point = ? Ar (Investisseurs)"
                      type="number"
                      value={formData.exchangeRates.pointsToArInvestor}
                      onChange={(e) => setFormData({
                        ...formData,
                        exchangeRates: {
                          ...formData.exchangeRates,
                          pointsToArInvestor: parseFloat(e.target.value) || 0
                        }
                      })}
                    />
                    
                    <Input
                      label="1 Point = ? Ar (Non-investisseurs)"
                      type="number"
                      value={formData.exchangeRates.pointsToArNonInvestor}
                      onChange={(e) => setFormData({
                        ...formData,
                        exchangeRates: {
                          ...formData.exchangeRates,
                          pointsToArNonInvestor: parseFloat(e.target.value) || 0
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'limits' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Sliders className="inline mr-2 h-5 w-5" />
                Limites et Frais
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Dépôts Minimum</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Minimum Ar"
                      type="number"
                      value={formData.limits.minDeposit.ar}
                      onChange={(e) => setFormData({
                        ...formData,
                        limits: {
                          ...formData.limits,
                          minDeposit: {
                            ...formData.limits.minDeposit,
                            ar: parseFloat(e.target.value) || 0
                          }
                        }
                      })}
                    />
                    
                    <Input
                      label="Minimum USDT"
                      type="number"
                      value={formData.limits.minDeposit.usdt}
                      onChange={(e) => setFormData({
                        ...formData,
                        limits: {
                          ...formData.limits,
                          minDeposit: {
                            ...formData.limits.minDeposit,
                            usdt: parseFloat(e.target.value) || 0
                          }
                        }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Retraits Minimum</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Input
                      label="Minimum Ar"
                      type="number"
                      value={formData.limits.minWithdrawal.ar}
                      onChange={(e) => setFormData({
                        ...formData,
                        limits: {
                          ...formData.limits,
                          minWithdrawal: {
                            ...formData.limits.minWithdrawal,
                            ar: parseFloat(e.target.value) || 0
                          }
                        }
                      })}
                    />
                    
                    <Input
                      label="Minimum USDT"
                      type="number"
                      value={formData.limits.minWithdrawal.usdt}
                      onChange={(e) => setFormData({
                        ...formData,
                        limits: {
                          ...formData.limits,
                          minWithdrawal: {
                            ...formData.limits.minWithdrawal,
                            usdt: parseFloat(e.target.value) || 0
                          }
                        }
                      })}
                    />
                  </div>
                </div>

                <div>
                  <Input
                    label="Frais de retrait (%)"
                    type="number"
                    step="0.01"
                    value={formData.limits.withdrawalFee * 100}
                    onChange={(e) => setFormData({
                      ...formData,
                      limits: {
                        ...formData.limits,
                        withdrawalFee: (parseFloat(e.target.value) || 0) / 100
                      }
                    })}
                  />
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'validation' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Shield className="inline mr-2 h-5 w-5" />
                Modes de Validation
              </h3>
              
              <div className="space-y-6">
                {Object.entries(formData.validation).map(([key, value]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {key === 'deposits' ? 'Dépôts' :
                       key === 'withdrawals' ? 'Retraits' :
                       key === 'pointsExchange' ? 'Échange de points' :
                       key === 'tasks' ? 'Micro-tâches' : key}
                    </label>
                    <select
                      value={value}
                      onChange={(e) => setFormData({
                        ...formData,
                        validation: {
                          ...formData.validation,
                          [key]: e.target.value as 'manual' | 'automatic'
                        }
                      })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
                    >
                      <option value="manual">Validation manuelle</option>
                      <option value="automatic">Validation automatique</option>
                    </select>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                <Bell className="inline mr-2 h-5 w-5" />
                Notifications
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications.email}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        email: e.target.checked
                      }
                    })}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Notifications Email</p>
                    <p className="text-sm text-gray-600">Envoyer des emails pour les transactions importantes</p>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications.whatsapp}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        whatsapp: e.target.checked
                      }
                    })}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Notifications WhatsApp</p>
                    <p className="text-sm text-gray-600">Envoyer des messages WhatsApp pour les alertes</p>
                  </div>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.notifications.inApp}
                    onChange={(e) => setFormData({
                      ...formData,
                      notifications: {
                        ...formData.notifications,
                        inApp: e.target.checked
                      }
                    })}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium">Notifications In-App</p>
                    <p className="text-sm text-gray-600">Afficher les notifications dans l'application</p>
                  </div>
                </label>
              </div>
            </Card>
          )}
        </div>

        {/* Panneau de sauvegarde */}
        <div className="space-y-6">
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <Button onClick={handleSave} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                Sauvegarder
              </Button>
              
              <Button variant="outline" onClick={handleReset} className="w-full">
                <RefreshCw className="mr-2 h-4 w-4" />
                Réinitialiser
              </Button>
            </div>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <div className="space-y-2 text-sm text-yellow-800">
              <p><strong>⚠️ Attention :</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Les modifications affectent tous les utilisateurs</li>
                <li>Testez en mode développement avant production</li>
                <li>Sauvegardez avant modification importante</li>
                <li>Les taux de change impactent les conversions</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}