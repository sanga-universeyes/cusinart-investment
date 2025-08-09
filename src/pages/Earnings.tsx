import React, { useState } from 'react';
import { Award, TrendingUp, Users, Calendar, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { CurrencySelector } from '../components/ui/CurrencySelector';
import { formatCurrency } from '../utils/currency';

interface Earning {
  id: string;
  type: 'referral' | 'team' | 'daily' | 'points';
  amount: number;
  currency: 'ar' | 'usdt' | 'points';
  level?: number;
  source: string;
  description: string;
  date: Date;
}

export function Earnings() {
  const { user } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState<'ar' | 'usdt'>('ar');
  const [activeTab, setActiveTab] = useState<'referral' | 'team' | 'daily' | 'points'>('referral');
  const [dateFilter, setDateFilter] = useState<'3' | '7' | '30' | 'all'>('7');

  if (!user) return null;

  // Mock earnings data
  const mockEarnings: Earning[] = [
    {
      id: '1',
      type: 'referral',
      amount: 5000,
      currency: 'ar',
      level: 1,
      source: 'Marie Rabe',
      description: 'Commission parrainage niveau 1',
      date: new Date(2024, 11, 15, 10, 30)
    },
    {
      id: '2',
      type: 'team',
      amount: 180,
      currency: 'ar',
      level: 1,
      source: 'Jean Rakoto',
      description: 'Commission équipe quotidienne',
      date: new Date(2024, 11, 16, 9, 0)
    },
    {
      id: '3',
      type: 'daily',
      amount: 750,
      currency: 'ar',
      source: 'CUIZ 1',
      description: 'Revenu quotidien investissement',
      date: new Date(2024, 11, 16, 12, 0)
    },
    {
      id: '4',
      type: 'points',
      amount: 25,
      currency: 'points',
      source: 'Mission YouTube',
      description: 'Points gagnés mission',
      date: new Date(2024, 11, 16, 14, 30)
    }
  ];

  const getFilteredEarnings = () => {
    let filtered = mockEarnings.filter(e => e.type === activeTab);

    if (dateFilter !== 'all') {
      const days = parseInt(dateFilter);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filtered = filtered.filter(e => e.date >= cutoff);
    }

    return filtered.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const getTotalByType = (type: Earning['type']) => {
    return mockEarnings
      .filter(e => e.type === type)
      .reduce((sum, e) => sum + (e.currency === 'points' ? e.amount * 100 : e.amount), 0);
  };

  const getEarningIcon = (type: Earning['type']) => {
    switch (type) {
      case 'referral': return Award;
      case 'team': return Users;
      case 'daily': return TrendingUp;
      case 'points': return Award;
    }
  };

  const getEarningColor = (type: Earning['type']) => {
    switch (type) {
      case 'referral': return 'text-blue-600';
      case 'team': return 'text-green-600';
      case 'daily': return 'text-purple-600';
      case 'points': return 'text-yellow-600';
    }
  };

  const tabs = [
    { key: 'referral', label: 'Parrainage', icon: Award },
    { key: 'team', label: 'Équipe', icon: Users },
    { key: 'daily', label: 'Quotidien', icon: TrendingUp },
    { key: 'points', label: 'Points', icon: Award }
  ];

  const filteredEarnings = getFilteredEarnings();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Historique des Gains</h1>
          <p className="text-gray-600">Suivez l'évolution de vos revenus</p>
        </div>
        
        <CurrencySelector 
          selected={selectedCurrency}
          onChange={setSelectedCurrency}
        />
      </div>

      {/* Statistiques par type */}
      <div className="grid md:grid-cols-4 gap-6">
        {tabs.map(tab => {
          const total = getTotalByType(tab.key as Earning['type']);
          const Icon = tab.icon;
          
          return (
            <Card key={tab.key} className="text-center">
              <Icon className={`h-8 w-8 mx-auto mb-2 ${getEarningColor(tab.key as Earning['type'])}`} />
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(total, selectedCurrency)}
              </p>
              <p className="text-sm text-gray-600">{tab.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Filtres par date */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Période :</span>
          </div>
          
          <div className="flex space-x-2">
            {[
              { key: '3', label: '3 jours' },
              { key: '7', label: '7 jours' },
              { key: '30', label: '30 jours' },
              { key: 'all', label: 'Tout' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setDateFilter(filter.key as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  dateFilter === filter.key
                    ? 'bg-[#006B76] text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 py-2 px-4 rounded-md text-sm font-medium whitespace-nowrap transition-all ${
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

      {/* Liste des gains */}
      <div className="space-y-4">
        {filteredEarnings.map(earning => {
          const Icon = getEarningIcon(earning.type);
          const colorClass = getEarningColor(earning.type);
          
          return (
            <Card key={earning.id} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">{earning.description}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-500">
                        {earning.date.toLocaleDateString('fr-FR')} à {earning.date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-sm text-gray-500">Source: {earning.source}</p>
                      {earning.level && (
                        <p className="text-xs text-gray-400">Niveau {earning.level}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-semibold text-green-600">
                    +{formatCurrency(earning.amount, earning.currency)}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredEarnings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun gain trouvé pour cette période</p>
          </div>
        )}
      </div>

      {/* Résumé de la période */}
      {filteredEarnings.length > 0 && (
        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="text-center">
            <h3 className="font-semibold text-green-900 mb-4">
              Résumé de la période ({dateFilter === 'all' ? 'Tout' : `${dateFilter} jours`})
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(
                    filteredEarnings
                      .filter(e => e.currency !== 'points')
                      .reduce((sum, e) => sum + e.amount, 0),
                    selectedCurrency
                  )}
                </p>
                <p className="text-sm text-green-700">Total gains argent</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-800">
                  {filteredEarnings
                    .filter(e => e.currency === 'points')
                    .reduce((sum, e) => sum + e.amount, 0)}
                </p>
                <p className="text-sm text-green-700">Total points gagnés</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-800">
                  {Math.round(
                    filteredEarnings
                      .filter(e => e.currency !== 'points')
                      .reduce((sum, e) => sum + e.amount, 0) / 
                    (dateFilter === 'all' ? 30 : parseInt(dateFilter))
                  )}
                </p>
                <p className="text-sm text-green-700">Moyenne/jour (Ar)</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}