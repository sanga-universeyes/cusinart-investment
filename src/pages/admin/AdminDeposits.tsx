import React, { useState } from 'react';
import { 
  ArrowDownRight, 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye,
  Clock,
  AlertTriangle,
  Download
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../utils/currency';
import { Transaction } from '../../types';
import toast from 'react-hot-toast';

export function AdminDeposits() {
  const { transactions, approveTransaction, rejectTransaction } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all');
  const [currencyFilter, setCurrencyFilter] = useState<'all' | 'ar' | 'usdt'>('all');
  const [selectedDeposit, setSelectedDeposit] = useState<Transaction | null>(null);
  const [showProofModal, setShowProofModal] = useState(false);

  // Mock deposits data
  const mockDeposits: Transaction[] = [
    {
      id: 'DEP001',
      userId: 'user1',
      type: 'deposit',
      currency: 'ar',
      amount: 50000,
      status: 'pending',
      method: 'MVola',
      proofImage: 'proof1.jpg',
      reference: 'MVL123456',
      createdAt: new Date(2024, 11, 15, 10, 30),
      updatedAt: new Date()
    },
    {
      id: 'DEP002',
      userId: 'user2',
      type: 'deposit',
      currency: 'usdt',
      amount: 25,
      status: 'completed',
      method: 'USDT TRC20',
      proofImage: 'proof2.jpg',
      reference: 'TRC789012',
      createdAt: new Date(2024, 11, 15, 14, 15),
      updatedAt: new Date()
    },
    {
      id: 'DEP003',
      userId: 'user3',
      type: 'deposit',
      currency: 'ar',
      amount: 100000,
      status: 'pending',
      method: 'Airtel Money',
      proofImage: 'proof3.jpg',
      reference: 'AIR345678',
      createdAt: new Date(2024, 11, 16, 9, 45),
      updatedAt: new Date()
    }
  ];

  const filteredDeposits = mockDeposits.filter(deposit => {
    const matchesSearch = 
      deposit.reference?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || deposit.status === statusFilter;
    const matchesCurrency = currencyFilter === 'all' || deposit.currency === currencyFilter;
    
    return matchesSearch && matchesStatus && matchesCurrency;
  });

  const handleApprove = async (depositId: string) => {
    try {
      await approveTransaction(depositId);
      toast.success('Dépôt approuvé avec succès');
    } catch (error) {
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (depositId: string) => {
    const reason = window.prompt('Raison du rejet :');
    if (reason) {
      try {
        await rejectTransaction(depositId, reason);
        toast.success('Dépôt rejeté');
      } catch (error) {
        toast.error('Erreur lors du rejet');
      }
    }
  };

  const viewProof = (deposit: Transaction) => {
    setSelectedDeposit(deposit);
    setShowProofModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const pendingCount = filteredDeposits.filter(d => d.status === 'pending').length;
  const totalAmount = filteredDeposits
    .filter(d => d.status === 'completed')
    .reduce((sum, d) => sum + (d.currency === 'ar' ? d.amount : d.amount * 5000), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Dépôts</h1>
          <p className="text-gray-600">
            {pendingCount} dépôt(s) en attente • Total validé: {formatCurrency(totalAmount, 'ar')}
          </p>
        </div>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter
        </Button>
      </div>

      {/* Alertes */}
      {pendingCount > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div>
              <p className="font-medium text-yellow-900">
                {pendingCount} dépôt(s) en attente de validation
              </p>
              <p className="text-sm text-yellow-700">
                Vérifiez les preuves de paiement et validez rapidement
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
              placeholder="Rechercher par référence ou ID..."
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
              value={currencyFilter}
              onChange={(e) => setCurrencyFilter(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
            >
              <option value="all">Toutes devises</option>
              <option value="ar">Ariary</option>
              <option value="usdt">USDT</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Liste des dépôts */}
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
                  Montant
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
              {filteredDeposits.map((deposit) => (
                <tr key={deposit.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {deposit.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        Réf: {deposit.reference}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ID: {deposit.userId}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(deposit.amount, deposit.currency)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {deposit.method}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={deposit.status}>
                      {deposit.status === 'pending' ? 'En attente' :
                       deposit.status === 'completed' ? 'Validé' : 'Rejeté'}
                    </StatusBadge>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {deposit.createdAt.toLocaleDateString('fr-FR')}
                    <br />
                    {deposit.createdAt.toLocaleTimeString('fr-FR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => viewProof(deposit)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir la preuve"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {deposit.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleApprove(deposit.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approuver"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => handleReject(deposit.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Rejeter"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDeposits.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <ArrowDownRight className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun dépôt trouvé</p>
          </div>
        )}
      </Card>

      {/* Modal de preuve */}
      {showProofModal && selectedDeposit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Preuve de paiement</h3>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Transaction: {selectedDeposit.id}</p>
                <p className="text-sm text-gray-600">
                  Montant: {formatCurrency(selectedDeposit.amount, selectedDeposit.currency)}
                </p>
                <p className="text-sm text-gray-600">Référence: {selectedDeposit.reference}</p>
              </div>
              
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">Capture d'écran de la preuve</p>
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                  <p className="text-gray-500">Image: {selectedDeposit.proofImage}</p>
                </div>
              </div>
              
              {selectedDeposit.status === 'pending' && (
                <div className="flex space-x-3">
                  <Button
                    onClick={() => {
                      handleApprove(selectedDeposit.id);
                      setShowProofModal(false);
                    }}
                    className="flex-1"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approuver
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleReject(selectedDeposit.id);
                      setShowProofModal(false);
                    }}
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Rejeter
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}