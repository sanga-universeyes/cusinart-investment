import React, { useState } from 'react';
import { Calendar, Filter, Download, ArrowUpRight, ArrowDownRight, TrendingUp, Award, RefreshCw, Search, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
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
  const [searchTerm, setSearchTerm] = useState('');

  if (!user) return null;

  // Données de démonstration enrichies
  const mockTransactions: Transaction[] = [
    {
      id: 'TXN001',
      type: 'deposit',
      currency: 'ar',
      amount: 50000,
      status: 'completed',
      method: 'MVola',
      reference: 'DEP123456',
      createdAt: new Date(2024, 11, 16, 14, 30),
      description: 'Dépôt via MVola'
    },
    {
      id: 'TXN002',
      type: 'investment',
      currency: 'ar',
      amount: 25000,
      status: 'completed',
      reference: 'INV789012',
      createdAt: new Date(2024, 11, 16, 15, 45),
      description: 'Investissement CUIZ 1'
    },
    {
      id: 'TXN003',
      type: 'commission',
      currency: 'ar',
      amount: 2500,
      status: 'completed',
      reference: 'COM345678',
      createdAt: new Date(2024, 11, 16, 9, 15),
      description: 'Commission parrainage niveau 1'
    },
    {
      id: 'TXN004',
      type: 'withdrawal',
      currency: 'ar',
      amount: 10000,
      status: 'pending',
      method: 'Airtel Money',
      reference: 'WTH901234',
      createdAt: new Date(2024, 11, 16, 16, 20),
      description: 'Retrait vers Airtel Money'
    },
    {
      id: 'TXN005',
      type: 'points_exchange',
      currency: 'points',
      amount: 50,
      status: 'completed',
      reference: 'PEX567890',
      createdAt: new Date(2024, 11, 16, 10, 30),
      description: 'Échange 50 points contre 5000 Ar'
    },
    {
      id: 'TXN006',
      type: 'bonus',
      currency: 'ar',
      amount: 2000,
      status: 'completed',
      reference: 'BON123456',
      createdAt: new Date(2024, 11, 15, 12, 0),
      description: 'Bonus d\'inscription'
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

    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
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
      deposit: 'text-green-600 bg-green-100',
      withdrawal: 'text-red-600 bg-red-100',
      investment: 'text-blue-600 bg-blue-100',
      commission: 'text-yellow-600 bg-yellow-100',
      bonus: 'text-purple-600 bg-purple-100',
      points_exchange: 'text-orange-600 bg-orange-100',
      points_purchase: 'text-orange-600 bg-orange-100'
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
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
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Historique des Transactions</h1>
          <p className="text-gray-600">{filteredTransactions.length} transaction(s) trouvée(s)</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <CurrencySelector 
            selected={selectedCurrency}
            onChange={setSelectedCurrency}
          />
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            <span className="hidden md:inline">Exporter</span>
          </Button>
        </div>
      </div>

      {/* Recherche */}
      <Card>
        <Input
          placeholder="Rechercher par description, référence ou ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
      </Card>

      {/* Filtres par date */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Période :</span>
          </div>
          
          <div className="flex space-x-2">
            {[
              { key: '3', label: '3j' },
              { key: '7', label: '7j' },
              { key: '30', label: '30j' },
              { key: 'all', label: 'Tout' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setDateFilter(filter.key as any)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  dateFilter === filter.key
                    ? 'bg-[#006B76] text-white shadow-lg'
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
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 overflow-x-auto shadow-inner">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 py-3 px-3 md:px-4 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#006B76] shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
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
            <Card key={transaction.id} hover className="bg-gradient-to-r from-white to-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                    <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mt-1 space-y-1 md:space-y-0">
                      <p className="text-sm text-gray-500">
                        {transaction.createdAt.toLocaleDateString('fr-FR')} à {transaction.createdAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">Réf: {transaction.reference}</p>
                      {transaction.method && (
                        <p className="text-xs text-gray-400">{transaction.method}</p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
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
          <div className="text-center py-16 text-gray-500">
            <Calendar className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Aucune transaction trouvée</p>
            <p className="text-sm mt-2">
              {searchTerm ? 'Essayez avec d\'autres mots-clés' : 'Vos transactions apparaîtront ici'}
            </p>
          </div>
        )}
      </div>

      {/* Résumé de la période */}
      {filteredTransactions.length > 0 && (
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center">
              <Eye className="mr-2 h-5 w-5" />
              Résumé de la période ({dateFilter === 'all' ? 'Tout' : `${dateFilter} jours`})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => t.type === 'deposit' && t.status === 'completed')
                      .reduce((sum, t) => sum + t.amount, 0),
                    selectedCurrency
                  )}
                </p>
                <p className="text-sm text-green-700 font-medium">Total dépôts</p>
              </div>
              <div className="bg-red-50 p-4 rounded-xl border border-red-200">
                <p className="text-2xl font-bold text-red-800">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => t.type === 'withdrawal' && t.status === 'completed')
                      .reduce((sum, t) => sum + t.amount, 0),
                    selectedCurrency
                  )}
                </p>
                <p className="text-sm text-red-700 font-medium">Total retraits</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                <p className="text-2xl font-bold text-yellow-800">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => ['commission', 'bonus'].includes(t.type) && t.status === 'completed')
                      .reduce((sum, t) => sum + t.amount, 0),
                    selectedCurrency
                  )}
                </p>
                <p className="text-sm text-yellow-700 font-medium">Commissions gagnées</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}