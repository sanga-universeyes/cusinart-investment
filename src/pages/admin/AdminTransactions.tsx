import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Award,
  RefreshCw,
  Calendar,
  Clock,
  XCircle,
  Activity
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'deposit' | 'withdrawal' | 'investment' | 'commission' | 'bonus' | 'points_exchange' | 'points_purchase';
  currency: 'ar' | 'usdt' | 'points';
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  method?: string;
  reference: string;
  createdAt: Date;
  description: string;
}

export function AdminTransactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | Transaction['type']>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | Transaction['status']>('all');
  const [dateFilter, setDateFilter] = useState<'today' | '7days' | '30days' | 'all'>('7days');

  // Mock transactions data
  const mockTransactions: Transaction[] = [
    {
      id: 'TXN001',
      userId: 'USR_953881',
      userName: 'Jean Rakoto',
      type: 'deposit',
      currency: 'ar',
      amount: 50000,
      status: 'completed',
      method: 'MVola',
      reference: 'DEP123456',
      createdAt: new Date(2024, 11, 16, 10, 30),
      description: 'Dépôt via MVola'
    },
    {
      id: 'TXN002',
      userId: 'USR_654321',
      userName: 'Marie Rabe',
      type: 'investment',
      currency: 'ar',
      amount: 25000,
      status: 'completed',
      reference: 'INV789012',
      createdAt: new Date(2024, 11, 16, 11, 45),
      description: 'Investissement CUIZ 1'
    },
    {
      id: 'TXN003',
      userId: 'USR_234567',
      userName: 'Paul Andry',
      type: 'withdrawal',
      currency: 'ar',
      amount: 45000,
      status: 'pending',
      method: 'Airtel Money',
      reference: 'WTH345678',
      createdAt: new Date(2024, 11, 16, 14, 20),
      description: 'Retrait vers Airtel Money'
    },
    {
      id: 'TXN004',
      userId: 'USR_789012',
      userName: 'Sophie Hery',
      type: 'commission',
      currency: 'ar',
      amount: 2500,
      status: 'completed',
      reference: 'COM901234',
      createdAt: new Date(2024, 11, 16, 15, 10),
      description: 'Commission parrainage niveau 1'
    },
    {
      id: 'TXN005',
      userId: 'USR_456789',
      userName: 'Luc Razaf',
      type: 'points_exchange',
      currency: 'points',
      amount: 50,
      status: 'pending',
      reference: 'PEX567890',
      createdAt: new Date(2024, 11, 16, 16, 30),
      description: 'Échange 50 points contre 5000 Ar'
    }
  ];

  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const days = dateFilter === 'today' ? 1 : dateFilter === '7days' ? 7 : 30;
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      matchesDate = transaction.createdAt >= cutoff;
    }
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

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
    return icons[type] || History;
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

  const getTypeLabel = (type: Transaction['type']) => {
    const labels = {
      deposit: 'Dépôt',
      withdrawal: 'Retrait',
      investment: 'Investissement',
      commission: 'Commission',
      bonus: 'Bonus',
      points_exchange: 'Échange Points',
      points_purchase: 'Achat Points'
    };
    return labels[type] || type;
  };

  const getTotalByStatus = (status: Transaction['status']) => {
    return filteredTransactions
      .filter(t => t.status === status)
      .reduce((sum, t) => {
        if (t.currency === 'points') {
          return sum + (t.amount * 100); // 1 point = 100 Ar
        }
        if (t.currency === 'usdt') {
          return sum + (t.amount * 5000); // 1 USDT = 5000 Ar
        }
        return sum + t.amount;
      }, 0);
  };

  const handleApprove = (transactionId: string) => {
    toast.success('Transaction approuvée !');
    // Ici vous ajouteriez la logique pour approuver la transaction
  };

  const handleReject = (transactionId: string) => {
    const reason = prompt('Raison du rejet :');
    if (reason) {
      toast.success('Transaction rejetée !');
      // Ici vous ajouteriez la logique pour rejeter la transaction
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Historique des Transactions</h1>
          <p className="text-gray-600">
            {filteredTransactions.length} transaction(s) • Total: {formatCurrency(getTotalByStatus('completed'), 'ar')}
          </p>
        </div>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="text-center">
          <ArrowDownRight className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(getTotalByStatus('completed'), 'ar')}
          </p>
          <p className="text-sm text-gray-600">Transactions validées</p>
        </Card>

        <Card className="text-center">
          <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(getTotalByStatus('pending'), 'ar')}
          </p>
          <p className="text-sm text-gray-600">En attente</p>
        </Card>

        <Card className="text-center">
          <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(getTotalByStatus('failed'), 'ar')}
          </p>
          <p className="text-sm text-gray-600">Échouées</p>
        </Card>

        <Card className="text-center">
          <Activity className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {filteredTransactions.length}
          </p>
          <p className="text-sm text-gray-600">Total transactions</p>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par utilisateur, référence ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5" />}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
            >
              <option value="all">Tous les types</option>
              <option value="deposit">Dépôts</option>
              <option value="withdrawal">Retraits</option>
              <option value="investment">Investissements</option>
              <option value="commission">Commissions</option>
              <option value="points_exchange">Échange Points</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Terminé</option>
              <option value="failed">Échoué</option>
              <option value="cancelled">Annulé</option>
            </select>

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
        </div>
      </Card>

      {/* Liste des transactions */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction) => {
                const Icon = getTransactionIcon(transaction.type);
                const colorClass = getTransactionColor(transaction.type);
                
                return (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          Réf: {transaction.reference}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {transaction.userName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.userId}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Icon className={`h-4 w-4 mr-2 ${colorClass}`} />
                        <span className="text-sm text-gray-900">
                          {getTypeLabel(transaction.type)}
                        </span>
                      </div>
                      {transaction.method && (
                        <div className="text-xs text-gray-500 mt-1">
                          {transaction.method}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={transaction.status}>
                        {transaction.status === 'completed' ? 'Terminé' :
                         transaction.status === 'pending' ? 'En attente' :
                         transaction.status === 'failed' ? 'Échoué' : 'Annulé'}
                      </StatusBadge>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {transaction.createdAt.toLocaleDateString('fr-FR')}
                      <br />
                      {transaction.createdAt.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {transaction.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprove(transaction.id)}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Approuver
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(transaction.id)}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              Rejeter
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune transaction trouvée</p>
          </div>
        )}
      </Card>

      {/* Résumé de la période */}
      {filteredTransactions.length > 0 && (
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 mb-4">
              Résumé de la période ({dateFilter === 'all' ? 'Tout' : 
                dateFilter === 'today' ? 'Aujourd\'hui' :
                dateFilter === '7days' ? '7 jours' : '30 jours'})
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => t.type === 'deposit' && t.status === 'completed')
                      .reduce((sum, t) => sum + t.amount, 0),
                    'ar'
                  )}
                </p>
                <p className="text-sm text-gray-600">Total dépôts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => t.type === 'withdrawal' && t.status === 'completed')
                      .reduce((sum, t) => sum + t.amount, 0),
                    'ar'
                  )}
                </p>
                <p className="text-sm text-gray-600">Total retraits</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    filteredTransactions
                      .filter(t => t.type === 'investment' && t.status === 'completed')
                      .reduce((sum, t) => sum + t.amount, 0),
                    'ar'
                  )}
                </p>
                <p className="text-sm text-gray-600">Total investissements</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}