import React, { useState } from 'react';
import { 
  RefreshCw, 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye,
  Award,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';

interface PointsExchange {
  id: string;
  userId: string;
  userName: string;
  pointsAmount: number;
  arAmount: number;
  usdtAmount: number;
  isInvestor: boolean;
  status: 'pending' | 'completed' | 'failed';
  reference: string;
  createdAt: Date;
}

export function AdminPointsExchange() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [userTypeFilter, setUserTypeFilter] = useState<'all' | 'investor' | 'non_investor'>('all');

  // Mock data
  const mockExchanges: PointsExchange[] = [
    {
      id: 'PEX001',
      userId: 'USR_953881',
      userName: 'Jean Rakoto',
      pointsAmount: 100,
      arAmount: 10000,
      usdtAmount: 2,
      isInvestor: true,
      status: 'pending',
      reference: 'PEX123456',
      createdAt: new Date(2024, 11, 16, 10, 30)
    },
    {
      id: 'PEX002',
      userId: 'USR_654321',
      userName: 'Marie Rabe',
      pointsAmount: 50,
      arAmount: 500,
      usdtAmount: 0.1,
      isInvestor: false,
      status: 'completed',
      reference: 'PEX789012',
      createdAt: new Date(2024, 11, 15, 14, 20)
    },
    {
      id: 'PEX003',
      userId: 'USR_234567',
      userName: 'Paul Andry',
      pointsAmount: 200,
      arAmount: 20000,
      usdtAmount: 4,
      isInvestor: true,
      status: 'pending',
      reference: 'PEX345678',
      createdAt: new Date(2024, 11, 16, 16, 15)
    }
  ];

  const filteredExchanges = mockExchanges.filter(exchange => {
    const matchesSearch = 
      exchange.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exchange.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exchange.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || exchange.status === statusFilter;
    const matchesUserType = userTypeFilter === 'all' || 
      (userTypeFilter === 'investor' && exchange.isInvestor) ||
      (userTypeFilter === 'non_investor' && !exchange.isInvestor);
    
    return matchesSearch && matchesStatus && matchesUserType;
  });

  const handleApprove = async (exchangeId: string) => {
    try {
      // Simuler l'approbation
      toast.success('Échange approuvé avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (exchangeId: string) => {
    const reason = window.prompt('Raison du rejet :');
    if (reason) {
      try {
        toast.success('Échange rejeté');
      } catch (error) {
        toast.error('Erreur lors du rejet');
      }
    }
  };

  const pendingCount = filteredExchanges.filter(e => e.status === 'pending').length;
  const totalPendingPoints = filteredExchanges
    .filter(e => e.status === 'pending')
    .reduce((sum, e) => sum + e.pointsAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Échange de Points</h1>
          <p className="text-gray-600">
            {pendingCount} échange(s) en attente • {totalPendingPoints} points à traiter
          </p>
        </div>
      </div>

      {/* Alertes */}
      {pendingCount > 5 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">
                Attention: {pendingCount} échanges en attente
              </p>
              <p className="text-sm text-yellow-700">
                Traitez rapidement pour maintenir la liquidité des points
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Statistiques */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          <p className="text-sm text-gray-600">En attente</p>
        </Card>

        <Card className="text-center">
          <Award className="h-8 w-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{totalPendingPoints}</p>
          <p className="text-sm text-gray-600">Points à traiter</p>
        </Card>

        <Card className="text-center">
          <RefreshCw className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {filteredExchanges.filter(e => e.status === 'completed').length}
          </p>
          <p className="text-sm text-gray-600">Échanges validés</p>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par utilisateur ou référence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5" />}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="completed">Validé</option>
              <option value="failed">Rejeté</option>
            </select>

            <select
              value={userTypeFilter}
              onChange={(e) => setUserTypeFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
            >
              <option value="all">Tous les utilisateurs</option>
              <option value="investor">Investisseurs</option>
              <option value="non_investor">Non-investisseurs</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Liste des échanges */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Échange
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Équivalent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Taux
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExchanges.map((exchange) => (
                <tr key={exchange.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {exchange.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        Réf: {exchange.reference}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {exchange.userName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {exchange.userId}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(exchange.pointsAmount, 'points')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(exchange.arAmount, 'ar')}
                    </div>
                    <div className="text-xs text-gray-500">
                      ≈ {formatCurrency(exchange.usdtAmount, 'usdt')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      exchange.isInvestor 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {exchange.isInvestor ? '100 Ar/pt' : '10 Ar/pt'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={exchange.status}>
                      {exchange.status === 'pending' ? 'En attente' :
                       exchange.status === 'completed' ? 'Validé' : 'Rejeté'}
                    </StatusBadge>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {exchange.createdAt.toLocaleDateString('fr-FR')}
                    <br />
                    {exchange.createdAt.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {exchange.status === 'pending' && (
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(exchange.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(exchange.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    
                    {exchange.status !== 'pending' && (
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredExchanges.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <RefreshCw className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun échange de points trouvé</p>
          </div>
        )}
      </Card>

      {/* Instructions pour les admins */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>📋 Instructions de traitement :</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Vérifiez le statut d'investisseur pour le bon taux de conversion</li>
            <li>Investisseurs: 1 point = 100 Ar</li>
            <li>Non-investisseurs: 1 point = 10 Ar</li>
            <li>Minimum d'échange: 20 points</li>
            <li>Tous les échanges sont loggés automatiquement</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}