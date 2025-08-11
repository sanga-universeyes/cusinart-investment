import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  Filter,
  Download,
  Eye,
  PieChart,
  Activity,
  Target,
  Award,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../contexts/AdminContext';
import { formatCurrency } from '../../utils/currency';

interface AnalyticsData {
  period: string;
  users: number;
  deposits: number;
  withdrawals: number;
  investments: number;
  commissions: number;
  revenue: number;
}

export function AdminAnalytics() {
  const { admin } = useAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [loading, setLoading] = useState(false);

  // Données simulées pour les analytics
  const mockData: AnalyticsData[] = [
    { period: 'Jan', users: 120, deposits: 45000000, withdrawals: 32000000, investments: 38000000, commissions: 2500000, revenue: 8000000 },
    { period: 'Fév', users: 180, deposits: 52000000, withdrawals: 38000000, investments: 45000000, commissions: 3200000, revenue: 9500000 },
    { period: 'Mar', users: 250, deposits: 68000000, withdrawals: 45000000, investments: 58000000, commissions: 4200000, revenue: 12000000 },
    { period: 'Avr', users: 320, deposits: 75000000, withdrawals: 52000000, investments: 68000000, commissions: 5200000, revenue: 14500000 },
    { period: 'Mai', users: 420, deposits: 92000000, withdrawals: 68000000, investments: 85000000, commissions: 6800000, revenue: 18000000 },
    { period: 'Juin', users: 580, deposits: 110000000, withdrawals: 85000000, investments: 102000000, commissions: 8500000, revenue: 22000000 },
  ];

  const periods = [
    { value: '7d', label: '7 jours' },
    { value: '30d', label: '30 jours' },
    { value: '90d', label: '90 jours' },
    { value: '1y', label: '1 an' },
    { value: 'all', label: 'Tout' }
  ];

  const metrics = [
    { value: 'revenue', label: 'Revenus', icon: DollarSign, color: 'text-green-600' },
    { value: 'users', label: 'Utilisateurs', icon: Users, color: 'text-blue-600' },
    { value: 'deposits', label: 'Dépôts', icon: ArrowDownRight, color: 'text-green-600' },
    { value: 'withdrawals', label: 'Retraits', icon: ArrowUpRight, color: 'text-red-600' },
    { value: 'investments', label: 'Investissements', icon: TrendingUp, color: 'text-purple-600' },
    { value: 'commissions', label: 'Commissions', icon: Award, color: 'text-yellow-600' }
  ];

  const currentData = mockData[mockData.length - 1];
  const previousData = mockData[mockData.length - 2];
  
  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const growthRates = {
    users: calculateGrowth(currentData.users, previousData.users),
    deposits: calculateGrowth(currentData.deposits, previousData.deposits),
    withdrawals: calculateGrowth(currentData.withdrawals, previousData.withdrawals),
    investments: calculateGrowth(currentData.investments, previousData.investments),
    commissions: calculateGrowth(currentData.commissions, previousData.commissions),
    revenue: calculateGrowth(currentData.revenue, previousData.revenue)
  };

  const topPerformers = [
    { name: 'Jean Dupont', id: 'USR001', totalInvested: 50000000, commissions: 2500000, referrals: 15 },
    { name: 'Marie Martin', id: 'USR002', totalInvested: 42000000, commissions: 2100000, referrals: 12 },
    { name: 'Pierre Durand', id: 'USR003', totalInvested: 38000000, commissions: 1900000, referrals: 10 },
    { name: 'Sophie Bernard', id: 'USR004', totalInvested: 35000000, commissions: 1750000, referrals: 8 },
    { name: 'Lucas Petit', id: 'USR005', totalInvested: 32000000, commissions: 1600000, referrals: 7 }
  ];

  const recentActivities = [
    { type: 'deposit', user: 'Jean Dupont', amount: 5000000, time: '2 min' },
    { type: 'withdrawal', user: 'Marie Martin', amount: 2500000, time: '5 min' },
    { type: 'investment', user: 'Pierre Durand', amount: 3000000, time: '8 min' },
    { type: 'commission', user: 'Sophie Bernard', amount: 150000, time: '12 min' },
    { type: 'registration', user: 'Nouveau utilisateur', amount: 0, time: '15 min' }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'deposit': return <ArrowDownRight className="h-4 w-4 text-green-600" />;
      case 'withdrawal': return <ArrowUpRight className="h-4 w-4 text-red-600" />;
      case 'investment': return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'commission': return <Award className="h-4 w-4 text-yellow-600" />;
      case 'registration': return <Users className="h-4 w-4 text-blue-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'deposit': return 'text-green-600';
      case 'withdrawal': return 'text-red-600';
      case 'investment': return 'text-purple-600';
      case 'commission': return 'text-yellow-600';
      case 'registration': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const handleExport = () => {
    setLoading(true);
    // Simuler l'export
    setTimeout(() => {
      toast.success('Rapport exporté avec succès');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006B76] to-[#006B76]/80 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Analytics & Rapports
            </h1>
            <p className="opacity-90">
              Analyse détaillée des performances de la plateforme
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={loading}
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Exporter
            </Button>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Période:</span>
            </div>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            >
              {periods.map(period => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Métrique:</span>
            </div>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
            >
              {metrics.map(metric => (
                <option key={metric.value} value={metric.value}>
                  {metric.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map((metric) => {
          const currentValue = currentData[metric.value as keyof AnalyticsData] as number;
          const growth = growthRates[metric.value as keyof typeof growthRates];
          const isCurrency = ['revenue', 'deposits', 'withdrawals', 'investments', 'commissions'].includes(metric.value);
          
          return (
            <Card key={metric.value} hover>
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center`}>
                  <metric.icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <div className="text-right">
                  <div className={`flex items-center text-xs font-medium ${
                    growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {growth >= 0 ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    {Math.abs(growth).toFixed(1)}%
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                  {metric.label}
                </p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {isCurrency ? formatCurrency(currentValue, 'ar') : currentValue.toLocaleString()}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Graphique et statistiques */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Graphique des tendances */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Évolution des {metrics.find(m => m.value === selectedMetric)?.label}
            </h3>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Graphique simulé */}
          <div className="h-64 bg-gray-50 rounded-lg flex items-end justify-between p-4 space-x-2">
            {mockData.map((data, index) => {
              const value = data[selectedMetric as keyof AnalyticsData] as number;
              const maxValue = Math.max(...mockData.map(d => d[selectedMetric as keyof AnalyticsData] as number));
              const height = (value / maxValue) * 100;
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-to-t from-[#006B76] to-[#006B76]/60 rounded-t"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-gray-500 mt-2">{data.period}</span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Top performers */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Top Performers
            </h3>
            <Button variant="ghost" size="sm">
              Voir tout
            </Button>
          </div>
          
          <div className="space-y-3">
            {topPerformers.map((performer, index) => (
              <div key={performer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#006B76] to-[#006B76]/80 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{performer.name}</p>
                    <p className="text-xs text-gray-500">{performer.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(performer.totalInvested, 'ar')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {performer.referrals} filleuls
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Activités récentes et distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Activités récentes */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Activités Récentes
            </h3>
            <Button variant="ghost" size="sm">
              Voir tout
            </Button>
          </div>
          
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {getActivityIcon(activity.type)}
                  <div>
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <p className={`text-sm font-medium ${getActivityColor(activity.type)}`}>
                      {activity.type === 'registration' ? 'Nouvelle inscription' : 
                       activity.type === 'deposit' ? 'Dépôt' :
                       activity.type === 'withdrawal' ? 'Retrait' :
                       activity.type === 'investment' ? 'Investissement' :
                       activity.type === 'commission' ? 'Commission' : activity.type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {activity.amount > 0 && (
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(activity.amount, 'ar')}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Distribution des investissements */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Distribution des Investissements
            </h3>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="text-sm font-medium">Plan Basic</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">35%</p>
                <p className="text-xs text-gray-500">{formatCurrency(35700000, 'ar')}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="text-sm font-medium">Plan Premium</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">45%</p>
                <p className="text-xs text-gray-500">{formatCurrency(45900000, 'ar')}</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-purple-500 rounded"></div>
                <span className="text-sm font-medium">Plan VIP</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">20%</p>
                <p className="text-xs text-gray-500">{formatCurrency(20400000, 'ar')}</p>
              </div>
            </div>
          </div>
          
          {/* Graphique circulaire simulé */}
          <div className="mt-6 flex justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-purple-500 relative">
              <div className="absolute inset-2 bg-white rounded-full"></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Statistiques détaillées */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Statistiques Détaillées
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">580</p>
            <p className="text-sm text-gray-600">Utilisateurs actifs</p>
            <p className="text-xs text-green-600 mt-1">+12% ce mois</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">85%</p>
            <p className="text-sm text-gray-600">Taux de conversion</p>
            <p className="text-xs text-green-600 mt-1">+5% ce mois</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">2.4</p>
            <p className="text-sm text-gray-600">Filleuls par utilisateur</p>
            <p className="text-xs text-green-600 mt-1">+8% ce mois</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">15.2%</p>
            <p className="text-sm text-gray-600">ROI moyen</p>
            <p className="text-xs text-green-600 mt-1">+2% ce mois</p>
          </div>
        </div>
      </Card>
    </div>
  );
}