import React, { useState } from 'react';
import { 
  Settings, 
  Database, 
  Shield, 
  Mail, 
  CreditCard, 
  Bell, 
  Globe, 
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Server,
  Activity,
  Zap,
  Palette
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../contexts/AdminContext';
import { toast } from 'react-hot-toast';

interface SystemConfig {
  // Paramètres généraux
  siteName: string;
  siteDescription: string;
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  emailVerificationRequired: boolean;
  
  // Paramètres financiers
  minDeposit: number;
  maxDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  withdrawalFee: number;
  depositFee: number;
  
  // Paramètres de sécurité
  maxLoginAttempts: number;
  sessionTimeout: number;
  twoFactorRequired: boolean;
  passwordMinLength: number;
  
  // Paramètres d'investissement
  minInvestment: number;
  maxInvestment: number;
  dailyReturnRate: number;
  maxInvestmentDuration: number;
  
  // Paramètres de commission
  referralBonus: number;
  level1Commission: number;
  level2Commission: number;
  level3Commission: number;
  
  // Paramètres de notification
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  
  // Paramètres de points
  pointsToAriary: number;
  ariaryToPoints: number;
  minPointsExchange: number;
  
  // Paramètres de maintenance
  maintenanceMessage: string;
  allowedIPs: string[];
  
  // Paramètres de performance
  cacheEnabled: boolean;
  cacheDuration: number;
  rateLimitEnabled: boolean;
  maxRequestsPerMinute: number;
}

export function AdminSystemSettings() {
  const { admin } = useAdmin();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [config, setConfig] = useState<SystemConfig>({
    // Paramètres généraux
    siteName: 'SavorLife',
    siteDescription: 'Savor the Good Life - Plateforme d\'investissement',
    maintenanceMode: false,
    registrationEnabled: true,
    emailVerificationRequired: true,
    
    // Paramètres financiers
    minDeposit: 10000,
    maxDeposit: 10000000,
    minWithdrawal: 5000,
    maxWithdrawal: 5000000,
    withdrawalFee: 2.5,
    depositFee: 0,
    
    // Paramètres de sécurité
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    twoFactorRequired: false,
    passwordMinLength: 8,
    
    // Paramètres d'investissement
    minInvestment: 5000,
    maxInvestment: 10000000,
    dailyReturnRate: 2.5,
    maxInvestmentDuration: 365,
    
    // Paramètres de commission
    referralBonus: 1000,
    level1Commission: 10,
    level2Commission: 5,
    level3Commission: 2,
    
    // Paramètres de notification
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    
    // Paramètres de points
    pointsToAriary: 10,
    ariaryToPoints: 0.1,
    minPointsExchange: 100,
    
    // Paramètres de maintenance
    maintenanceMessage: 'Site en maintenance. Veuillez réessayer plus tard.',
    allowedIPs: ['127.0.0.1', '::1'],
    
    // Paramètres de performance
    cacheEnabled: true,
    cacheDuration: 3600,
    rateLimitEnabled: true,
    maxRequestsPerMinute: 100
  });

  const tabs = [
    { id: 'general', label: 'Général', icon: Settings },
    { id: 'financial', label: 'Financier', icon: CreditCard },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'investment', label: 'Investissement', icon: Activity },
    { id: 'commission', label: 'Commissions', icon: Bell },
    { id: 'notifications', label: 'Notifications', icon: Mail },
    { id: 'points', label: 'Points', icon: Globe },
    { id: 'maintenance', label: 'Maintenance', icon: Server },
    { id: 'performance', label: 'Performance', icon: Zap }
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simuler une sauvegarde
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Paramètres sauvegardés avec succès');
    } catch (error) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
      // Réinitialiser les paramètres
      toast.success('Paramètres réinitialisés');
    }
  };

  const updateConfig = (key: keyof SystemConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Paramètres Généraux
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du site
            </label>
            <input
              type="text"
              value={config.siteName}
              onChange={(e) => updateConfig('siteName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description du site
            </label>
            <input
              type="text"
              value={config.siteDescription}
              onChange={(e) => updateConfig('siteDescription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Mode Maintenance
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Mode maintenance</h4>
              <p className="text-sm text-gray-600">Désactiver l'accès public au site</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.maintenanceMode}
                onChange={(e) => updateConfig('maintenanceMode', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#006B76]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006B76]"></div>
            </label>
          </div>
          
          {config.maintenanceMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message de maintenance
              </label>
              <textarea
                value={config.maintenanceMessage}
                onChange={(e) => updateConfig('maintenanceMessage', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
                placeholder="Message affiché aux utilisateurs pendant la maintenance..."
              />
            </div>
          )}
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CheckCircle className="mr-2 h-5 w-5" />
          Inscription & Vérification
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Inscription autorisée</h4>
              <p className="text-sm text-gray-600">Permettre aux nouveaux utilisateurs de s'inscrire</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.registrationEnabled}
                onChange={(e) => updateConfig('registrationEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#006B76]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006B76]"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Vérification email requise</h4>
              <p className="text-sm text-gray-600">Exiger la vérification email pour activer le compte</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.emailVerificationRequired}
                onChange={(e) => updateConfig('emailVerificationRequired', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#006B76]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006B76]"></div>
            </label>
          </div>
        </div>
      </Card>
    </div>
  );

  const renderFinancialSettings = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Limites de Dépôt
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dépôt minimum (Ar)
            </label>
            <input
              type="number"
              value={config.minDeposit}
              onChange={(e) => updateConfig('minDeposit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dépôt maximum (Ar)
            </label>
            <input
              type="number"
              value={config.maxDeposit}
              onChange={(e) => updateConfig('maxDeposit', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Limites de Retrait
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retrait minimum (Ar)
            </label>
            <input
              type="number"
              value={config.minWithdrawal}
              onChange={(e) => updateConfig('minWithdrawal', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retrait maximum (Ar)
            </label>
            <input
              type="number"
              value={config.maxWithdrawal}
              onChange={(e) => updateConfig('maxWithdrawal', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="mr-2 h-5 w-5" />
          Frais de Transaction
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frais de retrait (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={config.withdrawalFee}
              onChange={(e) => updateConfig('withdrawalFee', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frais de dépôt (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={config.depositFee}
              onChange={(e) => updateConfig('depositFee', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Paramètres de Connexion
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tentatives de connexion max
            </label>
            <input
              type="number"
              value={config.maxLoginAttempts}
              onChange={(e) => updateConfig('maxLoginAttempts', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout de session (minutes)
            </label>
            <input
              type="number"
              value={config.sessionTimeout}
              onChange={(e) => updateConfig('sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Lock className="mr-2 h-5 w-5" />
          Sécurité Avancée
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Authentification à deux facteurs</h4>
              <p className="text-sm text-gray-600">Exiger la 2FA pour tous les utilisateurs</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.twoFactorRequired}
                onChange={(e) => updateConfig('twoFactorRequired', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#006B76]/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#006B76]"></div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longueur minimale du mot de passe
            </label>
            <input
              type="number"
              value={config.passwordMinLength}
              onChange={(e) => updateConfig('passwordMinLength', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            />
          </div>
        </div>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'financial':
        return renderFinancialSettings();
      case 'security':
        return renderSecuritySettings();
      default:
        return (
          <Card>
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Section en développement
              </h3>
              <p className="text-gray-600">
                Cette section sera bientôt disponible
              </p>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006B76] to-[#006B76]/80 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Paramètres Système
            </h1>
            <p className="opacity-90">
              Configuration avancée de la plateforme
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleReset}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réinitialiser
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-white text-[#006B76] hover:bg-gray-100"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Sauvegarder
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Card>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${activeTab === tab.id
                    ? 'border-[#006B76] text-[#006B76]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </Card>

      {/* Tab Content */}
      {renderTabContent()}

      {/* Advanced Settings Toggle */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Palette className="mr-2 h-5 w-5" />
              Paramètres Avancés
            </h3>
            <p className="text-sm text-gray-600">
              Options de configuration avancées pour les développeurs
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showAdvanced ? 'Masquer' : 'Afficher'}
          </Button>
        </div>
        
        {showAdvanced && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IPs autorisées (maintenance)
                </label>
                <textarea
                  value={config.allowedIPs.join('\n')}
                  onChange={(e) => updateConfig('allowedIPs', e.target.value.split('\n').filter(ip => ip.trim()))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
                  placeholder="Une IP par ligne..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Limite de requêtes par minute
                </label>
                <input
                  type="number"
                  value={config.maxRequestsPerMinute}
                  onChange={(e) => updateConfig('maxRequestsPerMinute', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}