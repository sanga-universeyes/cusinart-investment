import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Ban, 
  Plus,
  Eye,
  DollarSign,
  UserCheck,
  UserX
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../utils/currency';
import { User } from '../../types';
import toast from 'react-hot-toast';

export function AdminUsers() {
  const { users, updateUser, deleteUser, suspendUser, addFunds } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended' | 'pending'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);

  // Mock users data - in real app, this would come from API
  const mockUsers: User[] = [
    {
      id: '1',
      phone: '+261346953881',
      firstName: 'Jean',
      lastName: 'Rakoto',
      email: 'jean@example.com',
      referralCode: 'USR_953881',
      balanceAr: 125000,
      balanceUsdt: 25.5,
      pointsBalance: 450,
      language: 'fr',
      status: 'active',
      isInvestor: true,
      createdAt: new Date(2024, 10, 15),
      updatedAt: new Date()
    },
    {
      id: '2',
      phone: '+261337654321',
      firstName: 'Marie',
      lastName: 'Rabe',
      email: 'marie@example.com',
      referralCode: 'USR_654321',
      balanceAr: 75000,
      balanceUsdt: 15.0,
      pointsBalance: 200,
      language: 'mg',
      status: 'active',
      isInvestor: false,
      createdAt: new Date(2024, 11, 1),
      updatedAt: new Date()
    },
    {
      id: '3',
      phone: '+261321234567',
      firstName: 'Paul',
      lastName: 'Andry',
      email: 'paul@example.com',
      referralCode: 'USR_234567',
      balanceAr: 0,
      balanceUsdt: 0,
      pointsBalance: 50,
      language: 'fr',
      status: 'suspended',
      isInvestor: false,
      createdAt: new Date(2024, 11, 10),
      updatedAt: new Date()
    }
  ];

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.referralCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleAddFunds = (user: User) => {
    setSelectedUser(user);
    setShowAddFundsModal(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await deleteUser(userId);
        toast.success('Utilisateur supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleSuspendUser = async (userId: string) => {
    const reason = window.prompt('Raison de la suspension :');
    if (reason) {
      try {
        await suspendUser(userId, reason);
        toast.success('Utilisateur suspendu');
      } catch (error) {
        toast.error('Erreur lors de la suspension');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Utilisateurs</h1>
          <p className="text-gray-600">{filteredUsers.length} utilisateur(s) trouvé(s)</p>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvel Utilisateur
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom, téléphone, code..."
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
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50 focus:border-[#006B76]"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="suspended">Suspendu</option>
              <option value="pending">En attente</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Soldes
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inscription
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-[#006B76] to-[#006B76]/80 rounded-full flex items-center justify-center text-white font-semibold">
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.referralCode}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.phone}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatCurrency(user.balanceAr, 'ar')}
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatCurrency(user.balanceUsdt, 'usdt')} • {formatCurrency(user.pointsBalance, 'points')}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <StatusBadge status={user.status}>
                        {user.status === 'active' ? 'Actif' : 
                         user.status === 'suspended' ? 'Suspendu' : 'En attente'}
                      </StatusBadge>
                      {user.isInvestor && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          <UserCheck className="w-3 h-3 mr-1" />
                          Investisseur
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt.toLocaleDateString('fr-FR')}
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleAddFunds(user)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <DollarSign className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleSuspendUser(user.id)}
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        <Ban className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun utilisateur trouvé</p>
          </div>
        )}
      </Card>
    </div>
  );
}