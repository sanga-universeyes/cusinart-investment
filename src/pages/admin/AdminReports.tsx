import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Eye,
  DollarSign,
  Users,
  Award,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatCurrency } from '../../utils/currency';

interface ReportData {
  period: string;
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  totalDeposits: number;
  totalWithdrawals: number;
  totalInvestments: number;
  totalCommissions: number;
  totalPointsExchanged: number;
  revenue: number;
  expenses: number;
  profit: number;
}

export function AdminReports() {
  const { admin } = useAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Données simulées
  const reportData: ReportData[] = [
    {
      period: 'Décembre 2024',
      totalUsers: 1250,
      activeUsers: 890,
      newUsers: 45,
      totalDeposits: 125000000,
      totalWithdrawals: 85000000,
      totalInvestments: 95000000,
      totalCommissions: 15000000,
      totalPointsExchanged: 50000,
      revenue: 125000000,
      expenses: 85000000,
      profit: 40000000
    },
    {
      period: 'Novembre 2024',
      totalUsers: 1205,
      activeUsers: 820,
      newUsers: 38,
      totalDeposits: 110000000,
      totalWithdrawals: 75000000,
      totalInvestments: 85000000,
      totalCommissions: 12000000,
      totalPointsExchanged: 45000,
      revenue: 110000000,
      expenses: 75000000,
      profit: 35000000
    },
    {
      period: 'Octobre 2024',
      totalUsers: 1167,
      activeUsers: 780,
      newUsers: 42,
      totalDeposits: 98000000,
      totalWithdrawals: 68000000,
      totalInvestments: 75000000,
      totalCommissions: 10000000,
      totalPointsExchanged: 40000,
      revenue: 98000000,
      expenses: 68000000,
      profit: 30000000
    }
  ];

  const currentData = reportData[0];
  const previousData = reportData[1];

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? TrendingUp : TrendingDown;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    // Simulation d'export
    console.log(`Exporting report in ${format} format`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports & Statistiques</h1>
          <p className="text-gray-600">Analysez les performances de votre plateforme</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => exportReport('csv')}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#006B76]"
            />
          </div>
          <div className="flex gap-2">
            {(['daily', 'weekly', 'monthly', 'yearly'] as const).map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
                className="capitalize"
              >
                {period === 'daily' ? 'Jour' : 
                 period === 'weekly' ? 'Semaine' :
                 period === 'monthly' ? 'Mois' : 'Année'}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Utilisateurs Total</p>
              <p className="text-2xl font-bold text-blue-900">{currentData.totalUsers.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {(() => {
                  const growth = calculateGrowth(currentData.totalUsers, previousData.totalUsers);
                  const GrowthIcon = getGrowthIcon(growth);
                  return (
                    <>
                      <GrowthIcon className={`h-4 w-4 mr-1 ${getGrowthColor(growth)}`} />
                      <span className={`text-sm ${getGrowthColor(growth)}`}>
                        {Math.abs(growth).toFixed(1)}%
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Revenus Totaux</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(currentData.revenue, 'ar')}
              </p>
              <div className="flex items-center mt-1">
                {(() => {
                  const growth = calculateGrowth(currentData.revenue, previousData.revenue);
                  const GrowthIcon = getGrowthIcon(growth);
                  return (
                    <>
                      <GrowthIcon className={`h-4 w-4 mr-1 ${getGrowthColor(growth)}`} />
                      <span className={`text-sm ${getGrowthColor(growth)}`}>
                        {Math.abs(growth).toFixed(1)}%
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Bénéfice Net</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(currentData.profit, 'ar')}
              </p>
              <div className="flex items-center mt-1">
                {(() => {
                  const growth = calculateGrowth(currentData.profit, previousData.profit);
                  const GrowthIcon = getGrowthIcon(growth);
                  return (
                    <>
                      <GrowthIcon className={`h-4 w-4 mr-1 ${getGrowthColor(growth)}`} />
                      <span className={`text-sm ${getGrowthColor(growth)}`}>
                        {Math.abs(growth).toFixed(1)}%
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Utilisateurs Actifs</p>
              <p className="text-2xl font-bold text-orange-900">{currentData.activeUsers.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {(() => {
                  const growth = calculateGrowth(currentData.activeUsers, previousData.activeUsers);
                  const GrowthIcon = getGrowthIcon(growth);
                  return (
                    <>
                      <GrowthIcon className={`h-4 w-4 mr-1 ${getGrowthColor(growth)}`} />
                      <span className={`text-sm ${getGrowthColor(growth)}`}>
                        {Math.abs(growth).toFixed(1)}%
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
            <Activity className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Detailed Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial Overview */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-green-500" />
            Aperçu Financier
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-green-600">Dépôts Totaux</p>
                <p className="font-semibold text-green-900">
                  {formatCurrency(currentData.totalDeposits, 'ar')}
                </p>
              </div>
              <ArrowDownRight className="h-5 w-5 text-green-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <div>
                <p className="text-sm text-red-600">Retraits Totaux</p>
                <p className="font-semibold text-red-900">
                  {formatCurrency(currentData.totalWithdrawals, 'ar')}
                </p>
              </div>
              <ArrowUpRight className="h-5 w-5 text-red-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-blue-600">Investissements</p>
                <p className="font-semibold text-blue-900">
                  {formatCurrency(currentData.totalInvestments, 'ar')}
                </p>
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-purple-600">Commissions</p>
                <p className="font-semibold text-purple-900">
                  {formatCurrency(currentData.totalCommissions, 'ar')}
                </p>
              </div>
              <Award className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </Card>

        {/* User Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="mr-2 h-5 w-5 text-blue-500" />
            Activité Utilisateur
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Nouveaux Utilisateurs</span>
              <span className="font-semibold text-gray-900">{currentData.newUsers}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${(currentData.newUsers / 100) * 100}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Taux d'Activité</span>
              <span className="font-semibold text-gray-900">
                {((currentData.activeUsers / currentData.totalUsers) * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${(currentData.activeUsers / currentData.totalUsers) * 100}%` }}
              ></div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Points Échangés</span>
              <span className="font-semibold text-gray-900">
                {currentData.totalPointsExchanged.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full" 
                style={{ width: `${(currentData.totalPointsExchanged / 100000) * 100}%` }}
              ></div>
            </div>
          </div>
        </Card>
      </div>

      {/* Historical Data */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <BarChart3 className="mr-2 h-5 w-5 text-purple-500" />
          Données Historiques
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Période</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Utilisateurs</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Revenus</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Bénéfice</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Dépôts</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Retraits</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((data, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{data.period}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{data.totalUsers.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatCurrency(data.revenue, 'ar')}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatCurrency(data.profit, 'ar')}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatCurrency(data.totalDeposits, 'ar')}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{formatCurrency(data.totalWithdrawals, 'ar')}</td>
                  <td className="py-3 px-4">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}