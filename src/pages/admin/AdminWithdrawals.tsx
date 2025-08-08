import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  Search, 
  Filter, 
  Check, 
  X, 
  Clock,
  AlertTriangle,
  Download,
  DollarSign
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../utils/currency';
import { Transaction } from '../../types';
import toast from 'react-hot-toast';

export function AdminWithdrawals() {
  const { transactions, approveTransaction, rejectTransaction } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [methodFilter, setMethodFilter] = useState<'all' | 'mvola' | 'airtel' | 'orange' | 'usdt'>('all');

  // Mock withdrawals data
  const mockWithdrawals: Transaction[] = [
    {
      id: 'WTH001',
      userId: 'user1',
      type: 'withdrawal',
      currency: 'ar',
      amount: 45000, // Net amount after 10% fee
      status: 'pending',
      method: 'MVola',
      reference: 'WTH123456',
      createdAt: new Date(2024, 11, 15, 16, 30),
      updatedAt: new Date()
    },
    {
      id: 'WTH002',
      userId: 'user2',
      type: 'withdrawal',
      currency: 'usdt',
      amount: 18, // Net amount after 10% fee
      status: 'completed',
      method: 'USDT TRC20',
      reference: 'WTH789012',
      createdAt: new Date(2024, 11, 14, 11, 15),
      updatedAt: new Date()
    },
    {
      id: 'WTH003',
      userId: 'user3',
      type: 'withdrawal',
      currency: 'ar',
      amount: 27000, // Net amount after 10% fee
      status: 'pending',
      method: 'Airtel Money',
      reference: 'WTH345678',
      createdAt: new Date(2024, 11, 16, 14, 20),
      updatedAt: new Date()
    }
  ];

  const filteredWithdrawals = mockWithdrawals.filter(withdrawal => {
    const matchesSearch = 
      withdrawal.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.userId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || withdrawal.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || 
      withdrawal.method?.toLowerCase().includes(methodFilter);
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleApprove = async (withdrawalId: string) => {
    if (window.confirm('Confirmer le traitement de ce retrait ?')) {
      try {
        await approveTransaction(withdrawalId);
        toast.success('Retrait approuvé et traité');
      } catch (error) {
        toast.error('Erreur lors du traitement');
      }
    }
  };

  const handleReject = async (withdrawalId: string) => {
    const reason = window.prompt('Raison du rejet (sera communiquée à l\'utilisateur) :');
    if (reason) {
      try {
        await rejectTransaction(withdrawalId, reason);
        toast.success('Retrait rejeté');
      } catch (error) {
        toast.error('Erreur lors du rejet');
      }
    }
  };

  const pendingCount = filteredWithdrawals.filter(w => w.status === 'pending').length;
  const pendingAmount = filteredWithdrawals
    .filter(w => w.status === 'pending')
    .reduce((sum, w) => sum + (w.currency === 'ar' ? w.amount : w.amount * 5000), 0);

  const totalProcessed = filteredWithdrawals
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + (w.currency === 'ar' ? w.amount : w.amount * 5000), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Retraits</h1>
          <p className="text-gray-600">
            {pendingCount} retrait(s) en attente • À traiter: {formatCurrency(pendingAmount, 'ar')}
          </p>
        </div>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
          <p className="text-sm text-gray-600">En attente</p>
        </Card>

        <Card className="text-center">
          <DollarSign className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(pendingAmount, 'ar')}
          </p>
          <p className="text-sm text-gray-600">Montant à traiter</p>
        </Card>

        <Card className="text-center">
          <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalProcessed, 'ar')}
          </p>
          <p className="text-sm text-gray-600">Total traité</p>
        </Card>
      </div>

      {/* Alertes */}
      {pendingCount > 5 && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">
                Attention: {pendingCount} retraits en attente
              </p>
              <p className="text-sm text-red-700">
                Délai recommandé: 12h maximum. Traitez rapidement pour maintenir la confiance.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Filtres */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par référence, ID transaction ou utilisateur..."
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
              <option value="completed">Traité</option>
              <option value="failed">Rejeté</option>
            </select>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
            >
              <option value="all">Toutes méthodes</option>
              <option value="mvola">MVola</option>
              <option value="airtel">Airtel Money</option>
              <option value="orange">Orange Money</option>
              <option value="usdt">USDT TRC20</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Liste des retraits */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Montant Net
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Méthode
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
              {filteredWithdrawals.map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {withdrawal.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        Réf: {withdrawal.reference}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ID: {withdrawal.userId}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(withdrawal.amount, withdrawal.currency)}
                      </div>
                      <div className="text-xs text-gray-500">
                        (après frais 10%)
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {withdrawal.method}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={withdrawal.status}>
                      {withdrawal.status === 'pending' ? 'En attente' :
                       withdrawal.status === 'completed' ? 'Traité' : 'Rejeté'}
                    </StatusBadge>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {withdrawal.createdAt.toLocaleDateString('fr-FR')}
                    <br />
                    {withdrawal.createdAt.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {withdrawal.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApprove(withdrawal.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Traiter
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(withdrawal.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Rejeter
                          </Button>
                        </>
                      )}
                      
                      {withdrawal.status === 'completed' && (
                        <span className="text-green-600 text-sm">✓ Traité</span>
                      )}
                      
                      {withdrawal.status === 'failed' && (
                        <span className="text-red-600 text-sm">✗ Rejeté</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredWithdrawals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ArrowUpRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun retrait trouvé</p>
          </div>
        )}
      </Card>

      {/* Instructions pour les admins */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>📋 Instructions de traitement :</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Vérifiez l'identité de l'utilisateur avant traitement</li>
            <li>Le montant affiché est déjà net (frais 10% déduits)</li>
            <li>Délai maximum recommandé : 12h</li>
            <li>En cas de doute, suspendez et contactez le Super Admin</li>
            <li>Tous les traitements sont loggés automatiquement</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}