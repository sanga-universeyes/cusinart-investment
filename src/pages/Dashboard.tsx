import React from 'react';
import { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Award, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  Eye,
  Plus,
  History,
  Building,
  CheckSquare,
  ShoppingCart,
  Gift,
  RefreshCw,
  LogOut,
  HelpCircle,
  Bell,
  Settings
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CurrencySelector } from '../components/ui/CurrencySelector';
import { ActionButton } from '../components/ui/ActionButton';
import { formatCurrency } from '../utils/currency';
import { brandConfig } from '../config/brand';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { notifications } = useNotifications();
  const navigate = useNavigate();
  const [selectedCurrency, setSelectedCurrency] = useState<'ar' | 'usdt'>('ar');

  if (!user) return null;

  // Actions principales (5 boutons en bas)
  const quickActions = [
    { 
      icon: Eye, 
      label: 'Tableau', 
      description: 'de bord', 
      action: () => navigate('/dashboard'),
      primary: true
    },
    { 
      icon: Wallet, 
      label: 'Dépôt', 
      description: 'Recharger', 
      action: () => navigate('/deposit'),
      primary: true
    },
    { 
      icon: ArrowUpRight, 
      label: 'Retrait', 
      description: 'Retirer', 
      action: () => navigate('/withdraw'),
      primary: true
    },
    { 
      icon: ShoppingCart, 
      label: 'Achat', 
      description: 'Investir', 
      action: () => navigate('/invest'),
      primary: true
    },
    { 
      icon: Users, 
      label: 'Mon', 
      description: 'Profil', 
      action: () => navigate('/profile'),
      primary: true
    }
  ];

  // Actions secondaires (9 boutons carrés)
  const secondaryActions = [
    { 
      icon: HelpCircle, 
      label: 'FAQ', 
      action: () => navigate('/faq')
    },
    { 
      icon: History, 
      label: 'Historique de transaction', 
      action: () => navigate('/history')
    },
    { 
      icon: Building, 
      label: 'Profil entreprise', 
      action: () => navigate('/company-profile')
    },
    { 
      icon: CheckSquare, 
      label: 'Micro-tâches', 
      action: () => navigate('/tasks')
    },
    { 
      icon: ShoppingCart, 
      label: 'Acheter des points', 
      action: () => navigate('/buy-points')
    },
    { 
      icon: RefreshCw, 
      label: 'Échanger des points', 
      action: () => navigate('/exchange-points')
    },
    { 
      icon: Award, 
      label: 'Historique des gains', 
      action: () => navigate('/earnings')
    },
    { 
      icon: LogOut, 
      label: 'Déconnexion', 
      action: () => {
        logout();
        navigate('/');
      }
    },
    { 
      icon: Users, 
      label: 'Équipe et Groupe', 
      action: () => navigate('/team')
    }
  ];

  // Convertir les montants selon la devise sélectionnée
  const getDisplayAmount = (amountAr: number, amountUsdt: number) => {
    return selectedCurrency === 'ar' ? amountAr : amountUsdt;
  };

  const getDisplayCurrency = () => selectedCurrency;

  // Données d'investissement simulées
  const mockInvestments = [
    { plan: 'CUIZ 1', amount: 50000, dailyReturn: 1500, status: 'active' },
    { plan: 'CUIZ 2', amount: 100000, dailyReturn: 3500, status: 'active' }
  ];

  const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalDailyReturn = mockInvestments.reduce((sum, inv) => sum + inv.dailyReturn, 0);

  return (
    <div className="space-y-6 pb-24 lg:pb-6 w-full">
      {/* Welcome Header */}
      <div className="bg-gradient-to-br from-[#006B76] via-[#006B76]/90 to-[#006B76]/80 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Bonjour, {user.firstName} ! 👋
            </h1>
            <p className="opacity-90 text-sm md:text-base">
              Bienvenue sur votre tableau de bord d'investissement
            </p>
            <div className="mt-3 flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs opacity-75">En ligne</span>
              </div>
              <div className="text-xs opacity-75">
                USER ID: <span className="font-mono font-bold">{user.referralCode}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Users className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Currency Selector */}
      <div className="flex justify-end">
        <CurrencySelector 
          selected={selectedCurrency}
          onChange={setSelectedCurrency}
          className="shadow-lg"
        />
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Solde {selectedCurrency === 'ar' ? 'Ariary' : 'USDT'}
              </h3>
              <Wallet className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(getDisplayAmount(user.balanceAr, user.balanceUsdt), getDisplayCurrency())}
            </p>
            <p className="text-sm text-green-600 font-medium mb-4">+5.2% ce mois</p>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigate('/withdraw')}
                className="flex-1 text-xs"
              >
                Retrait
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigate('/deposit')}
                className="flex-1 text-xs"
              >
                Dépôt
              </Button>
            </div>
          </div>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Points</h3>
              <Award className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(user.pointsBalance, 'points')}
            </p>
            <p className="text-sm text-blue-600 font-medium mb-4">
              ≈ {formatCurrency(user.pointsBalance * (user.isInvestor ? 100 : 10), 'ar')}
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => navigate('/exchange-points')}
              className="w-full text-xs"
            >
              Échanger
            </Button>
          </div>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/20 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Investissements</h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {formatCurrency(getDisplayAmount(totalInvested, totalInvested / 5000), getDisplayCurrency())}
            </p>
            <p className="text-sm text-green-600 font-medium mb-4">
              +{formatCurrency(totalDailyReturn, 'ar')}/jour
            </p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => navigate('/invest')}
              className="w-full text-xs"
            >
              Investir
            </Button>
          </div>
        </Card>
      </div>

      {/* Investissements Actifs */}
      {mockInvestments.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-green-500" />
              Mes Investissements Actifs
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/invest')}>
              Voir tout
            </Button>
          </div>
          <div className="space-y-3">
            {mockInvestments.map((investment, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-green-900">{investment.plan}</p>
                    <p className="text-sm text-green-700">
                      Investi: {formatCurrency(investment.amount, 'ar')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-800">
                    +{formatCurrency(investment.dailyReturn, 'ar')}
                  </p>
                  <p className="text-xs text-green-600">par jour</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Actions Principales - 5 boutons en bas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Settings className="mr-2 h-5 w-5" />
          Navigation Principale
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-4">
          {quickActions.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              description={action.description}
              onClick={action.action}
              variant="primary"
              className="aspect-square"
            />
          ))}
        </div>
      </div>

      {/* Actions Secondaires - 9 boutons carrés */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="mr-2 h-5 w-5" />
          Outils & Services
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-3 md:gap-4">
          {secondaryActions.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              description=""
              onClick={action.action}
              variant="secondary"
              className="aspect-square"
            />
          ))}
        </div>
      </div>

      {/* Zone de Notifications */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Bell className="mr-2 h-5 w-5 text-blue-500" />
            Notifications de Statut
          </h3>
          <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
            Voir tout
          </Button>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notifications.slice(0, 8).map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-md transition-all">
              <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${
                notification.status === 'success' ? 'bg-green-500 animate-pulse' :
                notification.status === 'pending' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">
                    {new Date(notification.createdAt).toLocaleString('fr-FR')}
                  </p>
                  {notification.reference && (
                    <p className="text-xs text-gray-500 font-mono">
                      Réf: {notification.reference}
                    </p>
                  )}
                </div>
              </div>
              {notification.amount && notification.currency && (
                <div className="text-right flex-shrink-0">
                  <p className={`text-sm font-bold ${
                    notification.type === 'deposit' || notification.type === 'commission' 
                      ? 'text-green-600' 
                      : 'text-blue-600'
                  }`}>
                    {formatCurrency(notification.amount, notification.currency)}
                  </p>
                </div>
              )}
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Aucune notification récente</p>
              <p className="text-sm mt-1">Vos activités apparaîtront ici</p>
            </div>
          )}
        </div>
      </Card>

      {/* Statistiques Rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-blue-900">3</p>
          <p className="text-sm text-blue-700">Filleuls</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-green-900">
            {formatCurrency(15000, 'ar')}
          </p>
          <p className="text-sm text-green-700">Commissions</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CheckSquare className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-purple-900">12</p>
          <p className="text-sm text-purple-700">Missions</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <Gift className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-yellow-900">
            {formatCurrency(totalDailyReturn, 'ar')}
          </p>
          <p className="text-sm text-yellow-700">Revenus/jour</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <TrendingUp className="h-8 w-8 text-red-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-red-900">
            {formatCurrency(totalInvested, 'ar')}
          </p>
          <p className="text-sm text-red-700">Investi</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
          <History className="h-8 w-8 text-indigo-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-indigo-900">24</p>
          <p className="text-sm text-indigo-700">Transactions</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
          <ShoppingCart className="h-8 w-8 text-pink-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-pink-900">5</p>
          <p className="text-sm text-pink-700">Plans Actifs</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <RefreshCw className="h-8 w-8 text-teal-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-teal-900">7j</p>
          <p className="text-sm text-teal-700">Membre</p>
        </Card>
      </div>
    </div>
  );
}