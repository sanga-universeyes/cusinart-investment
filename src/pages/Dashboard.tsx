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
  HelpCircle
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
      label: 'Tableau de bord', 
      description: 'Dashboard', 
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
      description: 'Retirer fonds', 
      action: () => navigate('/withdraw'),
      primary: true
    },
    { 
      icon: ShoppingCart, 
      label: 'Achat', 
      description: 'Investissement', 
      action: '/invest',
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
      action: () => navigate('/company')
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

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#006B76] to-[#006B76]/80 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bonjour, {user.firstName} ! 👋
        </h1>
        <p className="opacity-90">
          Bienvenue sur votre tableau de bord d'investissement
        </p>
      </div>

      {/* Currency Selector */}
      <div className="flex justify-end">
        <CurrencySelector 
          selected={selectedCurrency}
          onChange={setSelectedCurrency}
        />
      </div>

      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">
                Solde {selectedCurrency === 'ar' ? 'Ariary' : 'USDT'}
              </h3>
              <Wallet className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(getDisplayAmount(user.balanceAr, user.balanceUsdt), getDisplayCurrency())}
            </p>
            <p className="text-sm text-green-600 mt-2">+5.2% ce mois</p>
            <div className="mt-3 flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigate('/withdraw')}
                className="text-xs"
              >
                Retrait
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigate('/deposit')}
                className="text-xs"
              >
                Dépôt
              </Button>
            </div>
          </div>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Points</h3>
              <Award className="h-5 w-5 text-orange-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(user.pointsBalance, 'points')}
            </p>
            <p className="text-sm text-blue-600 mt-2">
              ≈ {formatCurrency(user.pointsBalance * (user.isInvestor ? 100 : 10), 'ar')}
            </p>
            <div className="mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigate('/exchange-points')}
                className="text-xs w-full"
              >
                Échanger
              </Button>
            </div>
          </div>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-16 -mt-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-600">Investissements Actifs</h3>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(getDisplayAmount(150000, 30), getDisplayCurrency())}
            </p>
            <p className="text-sm text-green-600 mt-2">+23.5% rendement</p>
            <div className="mt-3">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => navigate('/invest')}
                className="text-xs w-full"
              >
                Investir
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Actions Principales - 5 boutons en bas */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Navigation Principale</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              description={action.description}
              onClick={action.action}
              variant="primary"
            />
          ))}
        </div>
      </div>

      {/* Actions Secondaires - 9 boutons carrés */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Outils & Services</h2>
        <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
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
      <div className="grid md:grid-cols-1 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Notifications de Statut</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
              Voir tout
            </Button>
          </div>
          <div className="space-y-3">
            {notifications.slice(0, 5).map((notification) => (
              <div key={notification.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.status === 'success' ? 'bg-green-500' :
                  notification.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>Aucune notification récente</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}