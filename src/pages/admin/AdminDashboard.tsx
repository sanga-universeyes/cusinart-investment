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
  AlertTriangle,
  Activity,
  Shield,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  PieChart,
  BarChart3
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/currency';
import { useNavigate } from 'react-router-dom';

export function AdminDashboard() {
  const { stats, admin } = useAdmin();
  const navigate = useNavigate();

  const statCards = [
    {
      title: 'Utilisateurs Total',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: '+12%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Utilisateurs Actifs',
      value: stats.activeUsers.toLocaleString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: '+8%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Utilisateurs Inactifs',
      value: stats.inactiveUsers.toLocaleString(),
      icon: Users,
      color: 'text-gray-600',
      bgColor: 'bg-gray-100',
      trend: '-3%',
      trendColor: 'text-red-600'
    },
    {
      title: 'Investissements Actifs',
      value: formatCurrency(stats.totalInvestments, 'ar'),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: '+25%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Solde Total Utilisateurs',
      value: formatCurrency(stats.totalBalance, 'ar'),
      icon: Wallet,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      trend: '+18%',
      trendColor: 'text-green-600'
    },
    {
      title: 'Retraits en Attente',
      value: formatCurrency(stats.pendingWithdrawals, 'ar'),
      icon: ArrowUpRight,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      trend: '12 demandes',
      trendColor: 'text-yellow-600'
    },
    {
      title: 'Dépôts en Attente',
      value: formatCurrency(stats.pendingDeposits, 'ar'),
      icon: ArrowDownRight,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: '8 demandes',
      trendColor: 'text-yellow-600'
    },
    {
      title: 'Échanges Points en Attente',
      value: formatCurrency(stats.pendingPointsExchange, 'points'),
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      trend: '5 demandes',
      trendColor: 'text-yellow-600'
    }
  ];

  const recentActivities = [
    { 
      id: '1', 
      type: 'deposit', 
      user: 'Jean Rakoto', 
      userId: 'USR_953881',
      amount: '50,000 Ar', 
      time: '10:30',
      status: 'pending',
      method: 'MVola'
    },
    { 
      id: '2', 
      type: 'withdrawal', 
      user: 'Marie Rabe', 
      userId: 'USR_654321',
      amount: '25,000 Ar', 
      time: '10:15',
      status: 'completed',
      method: 'Airtel Money'
    },
    { 
      id: '3', 
      type: 'investment', 
      user: 'Paul Andry', 
      userId: 'USR_234567',
      amount: '100,000 Ar', 
      time: '09:45',
      status: 'completed',
      plan: 'CUIZ 2'
    },
    { 
      id: '4', 
      type: 'points', 
      user: 'Sophie Hery', 
      userId: 'USR_789012',
      amount: '150 points', 
      time: '09:30',
      status: 'pending',
      action: 'exchange'
    }
  ];

  const systemAlerts = [
    {
      id: '1',
      type: 'warning',
      title: 'Retraits en attente élevés',
      message: `${formatCurrency(stats.pendingWithdrawals, 'ar')} en attente de validation`,
      priority: 'high',
      action: () => navigate('/admin/withdrawals')
    },
    {
      id: '2',
      type: 'info',
      title: 'Nouveaux utilisateurs',
      message: `${Math.floor(stats.totalUsers * 0.1)} nouveaux inscrits cette semaine`,
      priority: 'medium',
      action: () => navigate('/admin/users')
    },
    {
      id: '3',
      type: 'success',
      title: 'Performance système',
      message: `Taux d'activité: ${Math.round((stats.activeUsers / stats.totalUsers) * 100)}%`,
      priority: 'low',
      action: null
    }
  ];

  const quickActions = [
    {
      title: 'Valider Dépôts',
      description: 'Traiter les dépôts en attente',
      icon: ArrowDownRight,
      color: 'bg-green-500',
      count: Math.floor(stats.pendingDeposits / 50000),
      action: () => navigate('/admin/deposits')
    },
    {
      title: 'Traiter Retraits',
      description: 'Valider les demandes de retrait',
      icon: ArrowUpRight,
      color: 'bg-red-500',
      count: Math.floor(stats.pendingWithdrawals / 25000),
      action: () => navigate('/admin/withdrawals')
    },
    {
      title: 'Gérer Utilisateurs',
      description: 'Modérer les comptes utilisateurs',
      icon: Users,
      color: 'bg-blue-500',
      count: stats.totalUsers,
      action: () => navigate('/admin/users')
    },
    {
      title: 'Micro-tâches',
      description: 'Valider les missions',
      icon: Award,
      color: 'bg-purple-500',
      count: 15,
      action: () => navigate('/admin/tasks')
    }
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Terminé
        </span>;
      case 'pending':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          En attente
        </span>;
      case 'failed':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <XCircle className="w-3 h-3 mr-1" />
          Échoué
        </span>;
      default:
        return null;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <Activity className="h-5 w-5 text-blue-600" />;
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };
  return (
    <div className="space-y-6 w-full">
      {/* Header avec informations admin */}
      <div className="bg-gradient-to-r from-[#006B76] to-[#006B76]/80 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Tableau de Bord Administrateur
            </h1>
            <p className="opacity-90">
              Bienvenue, {admin?.fullName} • Rôle: {admin?.role.replace('_', ' ')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-75">Dernière connexion</p>
            <p className="font-semibold">
              {admin?.lastLogin?.toLocaleDateString('fr-FR')} à {admin?.lastLogin?.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center shadow-lg`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="flex-1 ml-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs font-medium ${stat.trendColor}`}>
                    {stat.trend}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs mois dernier</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Alertes système importantes */}
      <div className="space-y-3">
        {systemAlerts.map(alert => (
          <Card key={alert.id} className={`${getAlertColor(alert.type)} cursor-pointer`} onClick={alert.action || undefined}>
            <div className="flex items-center space-x-3">
              {getAlertIcon(alert.type)}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                <p className="text-sm text-gray-600">{alert.message}</p>
              </div>
              {alert.action && (
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Actions rapides */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Activity className="mr-2 h-5 w-5" />
          Actions Rapides
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className="relative p-4 text-center bg-white hover:bg-gray-50 rounded-xl border border-gray-200 hover:border-[#006B76]/30 transition-all duration-200 hover:shadow-lg group"
            >
              <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-900">{action.title}</p>
              <p className="text-xs text-gray-500 mt-1">{action.description}</p>
              {action.count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px]">
                  {action.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Recent Activities & System Status */}
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Clock className="mr-2 h-5 w-5" />
              Activités Récentes
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/transactions')}>
              Voir tout
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivities.map(activity => (
              <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  {getActivityIcon(activity.type)}
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-xs text-gray-500">{getActivityLabel(activity.type)}</p>
                      {activity.method && <span className="text-xs text-gray-400">• {activity.method}</span>}
                      {activity.plan && <span className="text-xs text-gray-400">• {activity.plan}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{activity.amount}</p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Graphiques de performance */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Performance
            </h3>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Taux d'activité</span>
              <span className="text-sm font-semibold text-gray-900">
                {Math.round((stats.activeUsers / stats.totalUsers) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-[#006B76] to-[#006B76]/80 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Investisseurs</span>
              <span className="text-sm font-semibold text-gray-900">
                {Math.round((stats.activeUsers * 0.7 / stats.totalUsers) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${Math.round((stats.activeUsers * 0.7 / stats.totalUsers) * 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Croissance mensuelle</span>
              <span className="text-sm font-semibold text-green-600">+15%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full w-3/4 transition-all duration-500"></div>
            </div>
          </div>
        </Card>

        {/* Statistiques financières */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Finances
            </h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-green-900">Revenus du jour</p>
                <p className="text-lg font-bold text-green-800">
                  {formatCurrency(stats.totalInvestments * 0.04, 'ar')}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-blue-900">Commissions versées</p>
                <p className="text-lg font-bold text-blue-800">
                  {formatCurrency(stats.totalInvestments * 0.15, 'ar')}
                </p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-purple-900">Volume mensuel</p>
                <p className="text-lg font-bold text-purple-800">
                  {formatCurrency(stats.totalInvestments * 1.2, 'ar')}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Graphiques et métriques avancées */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Graphique des transactions */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Transactions (7 derniers jours)</h3>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { day: 'Lun', deposits: 85, withdrawals: 32, color: 'bg-blue-500' },
              { day: 'Mar', deposits: 92, withdrawals: 28, color: 'bg-green-500' },
              { day: 'Mer', deposits: 78, withdrawals: 45, color: 'bg-yellow-500' },
              { day: 'Jeu', deposits: 105, withdrawals: 38, color: 'bg-purple-500' },
              { day: 'Ven', deposits: 88, withdrawals: 42, color: 'bg-pink-500' },
              { day: 'Sam', deposits: 95, withdrawals: 35, color: 'bg-indigo-500' },
              { day: 'Dim', deposits: 72, withdrawals: 25, color: 'bg-red-500' }
            ].map((data, index) => (
              <div key={index} className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-600 w-8">{data.day}</span>
                <div className="flex-1 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${data.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${(data.deposits / 120) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-500 w-12">{data.deposits}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top utilisateurs */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Investisseurs</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/users')}>
              Voir tout
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Jean Rakoto', id: 'USR_953881', amount: 2500000, rank: 1 },
              { name: 'Marie Rabe', id: 'USR_654321', amount: 1800000, rank: 2 },
              { name: 'Paul Andry', id: 'USR_234567', amount: 1200000, rank: 3 },
              { name: 'Sophie Hery', id: 'USR_789012', amount: 950000, rank: 4 },
              { name: 'Luc Razaf', id: 'USR_456789', amount: 750000, rank: 5 }
            ].map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    user.rank === 1 ? 'bg-yellow-500' :
                    user.rank === 2 ? 'bg-gray-400' :
                    user.rank === 3 ? 'bg-orange-500' : 'bg-[#006B76]'
                  }`}>
                    {user.rank}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(user.amount, 'ar')}
                  </p>
                  <p className="text-xs text-gray-500">Total investi</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Métriques système */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          État du Système
        </h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="w-3 h-3 bg-green-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm font-medium text-green-900">Serveur</p>
            <p className="text-xs text-green-700">En ligne</p>
          </div>
          
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm font-medium text-blue-900">Base de données</p>
            <p className="text-xs text-blue-700">Opérationnelle</p>
          </div>
          
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm font-medium text-yellow-900">Paiements</p>
            <p className="text-xs text-yellow-700">Surveillance</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="w-3 h-3 bg-purple-500 rounded-full mx-auto mb-2 animate-pulse"></div>
            <p className="text-sm font-medium text-purple-900">API</p>
            <p className="text-xs text-purple-700">Stable</p>
          </div>
        </div>
      </Card>

      {/* Actions d'urgence */}
      <Card className="bg-red-50 border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-900">Actions d'Urgence</h3>
              <p className="text-sm text-red-700">
                Accès rapide aux fonctions critiques
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => navigate('/admin/security')}
            >
              <Shield className="mr-1 h-4 w-4" />
              Sécurité
            </Button>
            <Button 
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (window.confirm('Voulez-vous vraiment suspendre temporairement la plateforme ?')) {
                  alert('Mode maintenance activé');
                }
              }}
            >
              Mode Maintenance
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}