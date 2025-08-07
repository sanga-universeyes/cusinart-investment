import React from 'react';
import { 
  Users, 
  TrendingUp, 
  Wallet, 
  Clock, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  AlertTriangle
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { formatCurrency } from '../../utils/currency';

export function AdminDashboard() {
  const { stats } = useAdmin();

  const statCards = [
    {
      title: 'Utilisateurs Total',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Utilisateurs Actifs',
      value: stats.activeUsers.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Utilisateurs Inactifs',
      value: stats.inactiveUsers.toLocaleString(),
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100'
    },
    {
      title: 'Investissements Actifs',
      value: formatCurrency(stats.totalInvestments, 'ar'),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Solde Total Utilisateurs',
      value: formatCurrency(stats.totalBalance, 'ar'),
      icon: Wallet,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    },
    {
      title: 'Retraits en Attente',
      value: formatCurrency(stats.pendingWithdrawals, 'ar'),
      icon: ArrowUpRight,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Dépôts en Attente',
      value: formatCurrency(stats.pendingDeposits, 'ar'),
      icon: ArrowDownRight,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Échanges Points en Attente',
      value: formatCurrency(stats.pendingPointsExchange, 'points'),
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ];

  const recentActivities = [
    { id: '1', type: 'deposit', user: 'Jean Rakoto', amount: '50,000 Ar', time: '10:30' },
    { id: '2', type: 'withdrawal', user: 'Marie Rabe', amount: '25,000 Ar', time: '10:15' },
    { id: '3', type: 'investment', user: 'Paul Andry', amount: '100,000 Ar', time: '09:45' },
    { id: '4', type: 'points', user: 'Sophie Hery', amount: '150 points', time: '09:30' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownRight className="h-4 w-4 text-green-600" />;
      case 'withdrawal': return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'investment': return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'points': return <Award className="h-4 w-4 text-yellow-600" />;
      default: return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'deposit': return 'Dépôt';
      case 'withdrawal': return 'Retrait';
      case 'investment': return 'Investissement';
      case 'points': return 'Échange points';
      default: return 'Transaction';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Tableau de Bord Administrateur</h1>
        <p className="text-gray-600">Vue d'ensemble de la plateforme</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Activities & Alerts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getActivityIcon(activity.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <p className="text-xs text-gray-500">{getActivityLabel(activity.type)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{activity.amount}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* System Alerts */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Alertes Système</h3>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">
                  {stats.pendingWithdrawals > 500000 ? 'Retraits en attente élevés' : 'Système normal'}
                </p>
                <p className="text-xs text-yellow-700 mt-1">
                  {formatCurrency(stats.pendingWithdrawals, 'ar')} en attente de validation
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Users className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">Nouveaux utilisateurs</p>
                <p className="text-xs text-blue-700 mt-1">
                  {Math.floor(stats.totalUsers * 0.1)} nouveaux inscrits cette semaine
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Performance</p>
                <p className="text-xs text-green-700 mt-1">
                  Taux d'activité: {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-900">Gérer Utilisateurs</p>
          </button>
          
          <button className="p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <ArrowDownRight className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-green-900">Valider Dépôts</p>
          </button>
          
          <button className="p-4 text-center bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <ArrowUpRight className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-red-900">Traiter Retraits</p>
          </button>
          
          <button className="p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-purple-900">Plans Investissement</p>
          </button>
        </div>
      </Card>
    </div>
  );
}