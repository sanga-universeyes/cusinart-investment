import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  Send,
  Users,
  Settings
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../utils/currency';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'user' | 'transaction' | 'security';
  status: 'sent' | 'pending' | 'failed';
  target: 'all' | 'investors' | 'referrers' | 'specific';
  createdAt: string;
  sentAt?: string;
  recipients?: number;
  readCount?: number;
}

export function AdminNotifications() {
  const { admin } = useAdmin();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'system' | 'user' | 'transaction' | 'security'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Données simulées
  const notifications: Notification[] = [
    {
      id: '1',
      title: 'Maintenance Planifiée',
      message: 'Une maintenance est prévue le 15 décembre de 02h00 à 04h00',
      type: 'system',
      status: 'sent',
      target: 'all',
      createdAt: '2024-12-10T10:00:00Z',
      sentAt: '2024-12-10T10:05:00Z',
      recipients: 1250,
      readCount: 890
    },
    {
      id: '2',
      title: 'Nouveau Plan d\'Investissement',
      message: 'Découvrez notre nouveau plan CUIZ 3 avec 8% de rendement quotidien',
      type: 'user',
      status: 'sent',
      target: 'investors',
      createdAt: '2024-12-09T14:30:00Z',
      sentAt: '2024-12-09T14:35:00Z',
      recipients: 450,
      readCount: 320
    },
    {
      id: '3',
      title: 'Alerte de Sécurité',
      message: 'Connexion détectée depuis un nouvel appareil',
      type: 'security',
      status: 'pending',
      target: 'specific',
      createdAt: '2024-12-10T15:20:00Z',
      recipients: 1,
      readCount: 0
    },
    {
      id: '4',
      title: 'Retrait Approuvé',
      message: 'Votre retrait de 50,000 AR a été approuvé et sera traité dans 24h',
      type: 'transaction',
      status: 'sent',
      target: 'specific',
      createdAt: '2024-12-10T09:15:00Z',
      sentAt: '2024-12-10T09:16:00Z',
      recipients: 1,
      readCount: 1
    }
  ];

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = selectedFilter === 'all' || notification.type === selectedFilter;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'system': return Settings;
      case 'user': return Users;
      case 'transaction': return CheckCircle;
      case 'security': return AlertTriangle;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'system': return 'text-blue-600 bg-blue-100';
      case 'user': return 'text-green-600 bg-green-100';
      case 'transaction': return 'text-purple-600 bg-purple-100';
      case 'security': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Notifications</h1>
          <p className="text-gray-600">Gérez les notifications système et utilisateur</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouvelle Notification</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Notifications</p>
              <p className="text-2xl font-bold text-blue-900">{notifications.length}</p>
            </div>
            <Bell className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Envoyées</p>
              <p className="text-2xl font-bold text-green-900">
                {notifications.filter(n => n.status === 'sent').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">En Attente</p>
              <p className="text-2xl font-bold text-yellow-900">
                {notifications.filter(n => n.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Échouées</p>
              <p className="text-2xl font-bold text-red-900">
                {notifications.filter(n => n.status === 'failed').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher dans les notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            {(['all', 'system', 'user', 'transaction', 'security'] as const).map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="capitalize"
              >
                {filter === 'all' ? 'Tous' : 
                 filter === 'system' ? 'Système' :
                 filter === 'user' ? 'Utilisateur' :
                 filter === 'transaction' ? 'Transaction' : 'Sécurité'}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <Card>
        <div className="space-y-4">
          {filteredNotifications.map((notification) => {
            const TypeIcon = getTypeIcon(notification.type);
            return (
              <div key={notification.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      <TypeIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        <StatusBadge 
                          status={notification.status} 
                          className={getStatusColor(notification.status)}
                        />
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Type: {notification.type}</span>
                        <span>Cible: {notification.target}</span>
                        {notification.recipients && (
                          <span>Destinataires: {notification.recipients.toLocaleString()}</span>
                        )}
                        {notification.readCount !== undefined && (
                          <span>Lus: {notification.readCount.toLocaleString()}</span>
                        )}
                        <span>Créé: {new Date(notification.createdAt).toLocaleString('fr-FR')}</span>
                        {notification.sentAt && (
                          <span>Envoyé: {new Date(notification.sentAt).toLocaleString('fr-FR')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h2 className="text-xl font-bold mb-4">Nouvelle Notification</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]"
                  placeholder="Titre de la notification"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]"
                  placeholder="Contenu du message"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]">
                    <option value="system">Système</option>
                    <option value="user">Utilisateur</option>
                    <option value="transaction">Transaction</option>
                    <option value="security">Sécurité</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cible</label>
                  <select className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]">
                    <option value="all">Tous les utilisateurs</option>
                    <option value="investors">Investisseurs uniquement</option>
                    <option value="referrers">Parrains uniquement</option>
                    <option value="specific">Utilisateur spécifique</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Annuler
              </Button>
              <Button onClick={() => setShowCreateModal(false)}>
                <Send className="h-4 w-4 mr-2" />
                Envoyer
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}