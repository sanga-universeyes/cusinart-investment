import React, { useState } from 'react';
import { Calendar, Filter, Download, ArrowUpRight, ArrowDownRight, TrendingUp, Award, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CurrencySelector } from '../components/ui/CurrencySelector';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatCurrency } from '../utils/currency';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'commission' | 'bonus' | 'points_exchange' | 'points_purchase';
  currency: 'ar' | 'usdt' | 'points';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  method?: string;
  reference: string;
  createdAt: Date;
  description: string;
}

export function History() {
  const { user } = useAuth();
  const [selectedCurrency, setSelectedCurrency] = useState<'ar' | 'usdt'>('ar');
  const [activeTab, setActiveTab] = useState<'all' | 'deposits' | 'withdrawals' | 'investments' | 'points' | 'commissions'>('all');
  const [dateFilter, setDateFilter] = useState<'3' | '7' | '30' | 'all'>('7');

  if (!user) return null;

  // Données de démonstration
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      type: 'deposit',
      currency: 'ar',
      amount: 50000,
      status: 'completed',
      method: 'MVola',
      reference: 'DEP123456',
      createdAt: new Date(2024, 11, 10, 14, 30),
      description: 'Dépôt via MVola'
    },
    {
      id: '2',
      type: 'investment',
      currency: 'ar',
      amount: 25000,
      status: 'completed',
      reference: 'INV789012',
      createdAt: new Date(2024, 11, 10, 15, 45),
      description: 'Investissement CUIZ 1'
    },
    {
      id: '3',
      type: 'commission',
      currency: 'ar',
      amount: 2500,
      status: 'completed',
      reference: 'COM345678',
      createdAt: new Date(2024, 11, 11, 9, 15),
      description: 'Commission parrainage niveau 1'
    },
    {
      id: '4',
      type: 'withdrawal',
      currency: 'ar',
      amount: 10000,
      status: 'pending',
      method: 'Airtel Money',
      reference: 'WTH901234',
      createdAt: new Date(2024, 11, 11, 16, 20),
      description: 'Retrait vers Airtel Money'
    },
    {
      id: '5',
      type: 'points_exchange',
      currency: 'points',
      amount: 50,
      status: 'completed',
      reference: 'PEX567890',
      createdAt: new Date(2024, 11, 12, 10, 30),
      description: 'Échange 50 points contre 5000 Ar'
    }
  ];

  const getFilteredTransactions = () => {
    let filtered = mockTransactions;

    // Filtre par type
    if (activeTab !== 'all') {
      const typeMap = {
        deposits: ['deposit'],
        withdrawals: ['withdrawal'],
        investments: ['investment'],
        points: ['points_exchange', 'points_purchase'],
        commissions: ['commission', 'bonus']
      };
      filtered = filtered.filter(t => typeMap[activeTab]?.includes(t.type));
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const days = parseInt(dateFilter);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      filtered = filtered.filter(t => t.createdAt >= cutoff);
    }

    return filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  };

  const getTransactionIcon = (type: Transaction['type']) => {
    const icons = {
      deposit: ArrowDownRight,
      withdrawal: ArrowUpRight,
      investment: TrendingUp,
      commission: Award,
      bonus: Award,
      points_exchange: RefreshCw,
      points_purchase: RefreshCw
    };
    return icons[type] || ArrowUpRight;
  };

  const getTransactionColor = (type: Transaction['type']) => {
    const colors = {
      deposit: 'text-green-600',
      withdrawal: 'text-red-600',
      investment: 'text-blue-600',
      commission: 'text-yellow-600',
      bonus: 'text-purple-600',
      points_exchange: 'text-orange-600',
      points_purchase: 'text-orange-600'
    };
    return colors[type] || 'text-gray-600';
  };

  const tabs = [
    { key: 'all', label: 'Tout', icon: Calendar },
    { key: 'deposits', label: 'Dépôts', icon: ArrowDownRight },
    { key: 'withdrawals', label: 'Retraits', icon: ArrowUpRight },
    { key: 'investments', label: 'Investissements', icon: TrendingUp },
    { key: 'points', label: 'Points', icon: Award },
    { key: 'commissions', label: 'Commissions', icon: RefreshCw }
  ];

  const filteredTransactions = getFilteredTransactions();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Historique des Transactions</h1>
          <p className="text-gray-600">Consultez toutes vos transactions</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <CurrencySelector 
            selected={selectedCurrency}
            onChange={setSelectedCurrency}
          />
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
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

      {/* Liste des transactions */}
      <div className="space-y-4">
        {filteredTransactions.map(transaction => {
          const Icon = getTransactionIcon(transaction.type);
          const colorClass = getTransactionColor(transaction.type);
          
          return (
            <Card key={transaction.id} hover>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-sm text-gray-500">
                        {transaction.createdAt.toLocaleDateString('fr-FR')} à {transaction.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-gray-400">Réf: {transaction.reference}</p>
                      {transaction.method && (
                        <p className="text-xs text-gray-400">{transaction.method}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${
                    ['deposit', 'commission', 'bonus'].includes(transaction.type) 
                      ? 'text-green-600' 
                      : 'text-red-600'
                  }`}>
                    {['deposit', 'commission', 'bonus'].includes(transaction.type) ? '+' : '-'}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                  <div className="mt-1">
                    <StatusBadge status={transaction.status}>
                      {transaction.status === 'completed' ? 'Terminé' :
                       transaction.status === 'pending' ? 'En attente' :
                       transaction.status === 'failed' ? 'Échoué' : 'Annulé'}
                    </StatusBadge>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune transaction trouvée pour cette période</p>
          </div>
        )}
      </div>

      {/* Résumé */}
      {filteredTransactions.length > 0 && (
        <Card className="bg-gray-50">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Total des dépôts</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(
                  filteredTransactions
                    .filter(t => t.type === 'deposit' && t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0),
                  selectedCurrency
                )}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Total des retraits</p>
              <p className="text-lg font-semibold text-red-600">
                {formatCurrency(
                  filteredTransactions
                    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0),
                  selectedCurrency
                )}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Commissions gagnées</p>
              <p className="text-lg font-semibold text-yellow-600">
                {formatCurrency(
                  filteredTransactions
                    .filter(t => ['commission', 'bonus'].includes(t.type) && t.status === 'completed')
                    .reduce((sum, t) => sum + t.amount, 0),
                  selectedCurrency
                )}
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}