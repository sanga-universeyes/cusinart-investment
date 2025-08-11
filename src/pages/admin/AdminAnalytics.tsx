import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity,
  Calendar,
  Download,
  Filter,
  Eye,
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Award,
  Clock
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { LineChart, BarChart, PieChart as PieChartComponent } from '../../components/ui/Chart';
import { formatCurrency } from '../../utils/currency';

export function AdminAnalytics() {
  const { stats } = useAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Données simulées pour les graphiques détaillés
  const userActivityData = [
    { label: 'Lun', value: Math.floor(stats.activeUsers * 0.8) },
    { label: 'Mar', value: Math.floor(stats.activeUsers * 0.9) },
    { label: 'Mer', value: Math.floor(stats.activeUsers * 0.85) },
    { label: 'Jeu', value: Math.floor(stats.activeUsers * 0.95) },
    { label: 'Ven', value: Math.floor(stats.activeUsers * 1.0) },
    { label: 'Sam', value: Math.floor(stats.activeUsers * 0.7) },
    { label: 'Dim', value: Math.floor(stats.activeUsers * 0.6) },
  ];

  const revenueGrowthData = [
    { label: 'Sem 1', value: 150000 },
    { label: 'Sem 2', value: 180000 },
    { label: 'Sem 3', value: 220000 },
    { label: 'Sem 4', value: 195000 },
    { label: 'Sem 5', value: 240000 },
    { label: 'Sem 6', value: 280000 },
  ];

  const investmentPlansData = [
    { label: 'CUIZ 1', value: 45, color: '#006B76' },
    { label: 'CUIZ 2', value: 35, color: '#00A8CC' },
    { label: 'CUIZ 3', value: 20, color: '#4FC3F7' },
  ];

  const geographicData = [
    { label: 'Antananarivo', value: 40, color: '#006B76' },
    { label: 'Toamasina', value: 25, color: '#00A8CC' },
    { label: 'Antsirabe', value: 15, color: '#4FC3F7' },
    { label: 'Mahajanga', value: 12, color: '#81D4FA' },
    { label: 'Autres', value: 8, color: '#B3E5FC' },
  ];

  const transactionVolumeData = [
    { label: 'Jan', value: 85 },
    { label: 'Fév', value: 92 },
    { label: 'Mar', value: 78 },
    { label: 'Avr', value: 95 },
    { label: 'Mai', value: 88 },
    { label: 'Jun', value: 102 },
    { label: 'Jul', value: 115 },
  ];

  const kpiCards = [
    {
      title: 'Revenus Totaux',
      value: formatCurrency(stats.totalBalance + stats.totalInvestments, 'ar'),
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Taux de Conversion',
      value: '14.8%',
      change: '+2.1%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Valeur Vie Client',
      value: formatCurrency(125000, 'ar'),
      change: '+8.3%',
      changeType: 'positive',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Temps Moyen Session',
      value: '12m 34s',
      change: '+1.2%',
      changeType: 'positive',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics & Rapports</h1>
          <p className="text-gray-600">Vue d'ensemble détaillée de la performance</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006B76]/50"
          >
            <option value="7d">7 derniers jours</option>
            <option value="30d">30 derniers jours</option>
            <option value="90d">90 derniers jours</option>
            <option value="1y">1 an</option>
          </select>
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Exporter</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <Card key={index} hover>
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-xl ${kpi.bgColor} flex items-center justify-center shadow-lg`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
              <div className="flex-1 ml-4">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{kpi.title}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">{kpi.value}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-xs font-medium ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.change}
                  </span>
                  <span className="text-xs text-gray-500 ml-1">vs période précédente</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* User Activity */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Activité Utilisateurs (7 jours)
            </h3>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <LineChart data={userActivityData} width={400} height={200} />
        </Card>

        {/* Revenue Growth */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Croissance Revenus (6 semaines)
            </h3>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <BarChart data={revenueGrowthData} width={400} height={200} />
        </Card>
      </div>

      {/* More Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Investment Plans Distribution */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <PieChart className="mr-2 h-5 w-5" />
              Plans d'Investissement
            </h3>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <PieChartComponent data={investmentPlansData} size={200} />
        </Card>

        {/* Geographic Distribution */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Répartition Géographique
            </h3>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <PieChartComponent data={geographicData} size={200} />
        </Card>

        {/* Transaction Volume */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Volume Transactions
            </h3>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          <BarChart data={transactionVolumeData} width={250} height={150} />
        </Card>
      </div>

      {/* Detailed Tables */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Award className="mr-2 h-5 w-5" />
              Top Utilisateurs (Investissements)
            </h3>
            <Button variant="ghost" size="sm" onClick={() => {}}>
              Voir tout
            </Button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Jean Rakoto', id: 'USR_953881', amount: 250000, growth: '+15%' },
              { name: 'Marie Rabe', id: 'USR_654321', amount: 180000, growth: '+12%' },
              { name: 'Paul Andry', id: 'USR_234567', amount: 150000, growth: '+8%' },
              { name: 'Sophie Hery', id: 'USR_789012', amount: 120000, growth: '+10%' },
            ].map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold
                    ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-500'}`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(user.amount, 'ar')}</p>
                  <p className="text-xs text-green-600">{user.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Trends */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Tendances Récentes
            </h3>
          </div>
          <div className="space-y-4">
            {[
              {
                trend: 'Augmentation des dépôts mobiles',
                percentage: '+24%',
                description: 'Hausse significative des dépôts via MVola et Airtel Money',
                type: 'positive'
              },
              {
                trend: 'Amélioration du taux de rétention',
                percentage: '+8%',
                description: 'Les utilisateurs restent plus longtemps actifs',
                type: 'positive'
              },
              {
                trend: 'Pics d\'activité en soirée',
                percentage: '+15%',
                description: 'Activité maximale entre 18h et 21h',
                type: 'neutral'
              },
              {
                trend: 'Croissance des investissements CUIZ 2',
                percentage: '+32%',
                description: 'Plan le plus populaire ce mois',
                type: 'positive'
              },
            ].map((trend, index) => (
              <div key={index} className="border-l-4 border-[#006B76] pl-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900">{trend.trend}</p>
                  <span className={`text-sm font-bold ${
                    trend.type === 'positive' ? 'text-green-600' : 
                    trend.type === 'negative' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {trend.percentage}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1">{trend.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}