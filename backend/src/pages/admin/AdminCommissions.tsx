import React, { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  Users, 
  Calendar,
  Filter,
  Download,
  DollarSign
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../utils/currency';

interface Commission {
  id: string;
  userId: string;
  userName: string;
  fromUserId: string;
  fromUserName: string;
  type: 'referral' | 'team' | 'daily';
  level: number;
  percentage: number;
  amount: number;
  currency: 'ar' | 'usdt';
  planName?: string;
  createdAt: Date;
}

export function AdminCommissions() {
  const [activeTab, setActiveTab] = useState<'referral' | 'team' | 'daily'>('referral');
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'all'>('7days');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const mockCommissions: Commission[] = [
    {
      id: 'COM001',
      userId: 'user1',
      userName: 'Jean Rakoto',
      fromUserId: 'user2',
      fromUserName: 'Marie Rabe',
      type: 'referral',
      level: 1,
      percentage: 10,
      amount: 5000,
      currency: 'ar',
      planName: 'CUIZ 1',
      createdAt: new Date(2024, 11, 15, 10, 30)
    },
    {
      id: 'COM002',
      userId: 'user1',
      userName: 'Jean Rakoto',
      fromUserId: 'user3',
      fromUserName: 'Paul Andry',
      type: 'team',
      level: 1,
      percentage: 6,
      amount: 180,
      currency: 'ar',
      createdAt: new Date(2024, 11, 16, 9, 15)
    },
    {
      id: 'COM003',
      userId: 'user2',
      userName: 'Marie Rabe',
      fromUserId: 'user2',
      fromUserName: 'Marie Rabe',
      type: 'daily',
      level: 0,
      percentage: 3,
      amount: 2250,
      currency: 'ar',
      planName: 'CUIZ 2',
      createdAt: new Date(2024, 11, 16, 12, 0)
    }
  ];

  const filteredCommissions = mockCommissions.filter(commission => {
    const matchesTab = commission.type === activeTab;
    const matchesSearch = 
      commission.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.fromUserName.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const days = dateFilter === 'today' ? 1 : dateFilter === '7days' ? 7 : 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      matchesDate = commission.createdAt >= cutoff;
    }
    
    return matchesTab && matchesSearch && matchesDate;
  });

  const getTotalCommissions = (type: Commission['type']) => {
    return mockCommissions
      .filter(c => c.type === type)
      .reduce((sum, c) => sum + c.amount, 0);
  };

  const getTypeLabel = (type: Commission['type']) => {
    switch (type) {
      case 'referral': return 'Parrainage';
      case 'team': return 'Équipe';
      case 'daily': return 'Quotidien';
    }
  };

  const getTypeColor = (type: Commission['type']) => {
    switch (type) {
      case 'referral': return 'text-blue-600';
      case 'team': return 'text-green-600';
      case 'daily': return 'text-purple-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gains & Commissions</h1>
          <p className="text-gray-600">Suivi des commissions et revenus</p>
        </div>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <Award className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(getTotalCommissions('referral'), 'ar')}
          </p>
          <p className="text-sm text-gray-600">Commissions Parrainage</p>
        </Card>

        <Card className="text-center">
          <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(getTotalCommissions('team'), 'ar')}
          </p>
          <p className="text-sm text-gray-600">Commissions Équipe</p>
        </Card>

        <Card className="text-center">
          <TrendingUp className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(getTotalCommissions('daily'), 'ar')}
          </p>
          <p className="text-sm text-gray-600">Revenus Quotidiens</p>
        </Card>
      </div>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'referral', label: 'Parrainage', icon: Award },
          { key: 'team', label: 'Équipe', icon: Users },
          { key: 'daily', label: 'Quotidien', icon: TrendingUp }
        ].map(tab => (
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

      {/* Filtres */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom d'utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Filter className="h-5 w-5" />}
            />
          </div>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
          >
            <option value="today">Aujourd'hui</option>
            <option value="7days">7 derniers jours</option>
            <option value="30days">30 derniers jours</option>
            <option value="all">Toute la période</option>
          </select>
        </div>
      </Card>

      {/* Liste des commissions */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bénéficiaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Niveau
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCommissions.map((commission) => (
                <tr key={commission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {commission.userName}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {commission.userId}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {commission.fromUserName}
                    </div>
                    {commission.planName && (
                      <div className="text-sm text-gray-500">
                        Plan: {commission.planName}
                      </div>
                    )}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      commission.type === 'referral' ? 'bg-blue-100 text-blue-800' :
                      commission.type === 'team' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {getTypeLabel(commission.type)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {commission.level > 0 ? `Niveau ${commission.level}` : '-'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {commission.percentage}%
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`text-sm font-medium ${getTypeColor(commission.type)}`}>
                      {formatCurrency(commission.amount, commission.currency)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {commission.createdAt.toLocaleDateString('fr-FR')}
                    <br />
                    {commission.createdAt.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCommissions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune commission trouvée pour cette période</p>
          </div>
        )}
      </Card>
    </div>
  );
}