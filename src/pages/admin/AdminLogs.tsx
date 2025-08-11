import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Shield,
  Database,
  Server,
  Eye,
  Trash2
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: 'system' | 'user' | 'security' | 'database' | 'transaction';
  message: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
}

export function AdminLogs() {
  const { admin } = useAdmin();
  const [selectedLevel, setSelectedLevel] = useState<'all' | 'info' | 'warning' | 'error' | 'debug'>('all');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'system' | 'user' | 'security' | 'database' | 'transaction'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  // Données simulées
  const logs: LogEntry[] = [
    {
      id: '1',
      timestamp: '2024-12-10T15:30:00Z',
      level: 'info',
      category: 'user',
      message: 'Utilisateur connecté avec succès',
      userId: 'user123',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    {
      id: '2',
      timestamp: '2024-12-10T15:25:00Z',
      level: 'warning',
      category: 'security',
      message: 'Tentative de connexion échouée - mot de passe incorrect',
      userId: 'user456',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)'
    },
    {
      id: '3',
      timestamp: '2024-12-10T15:20:00Z',
      level: 'error',
      category: 'database',
      message: 'Erreur de connexion à la base de données',
      details: { error: 'Connection timeout', retryCount: 3 }
    },
    {
      id: '4',
      timestamp: '2024-12-10T15:15:00Z',
      level: 'info',
      category: 'transaction',
      message: 'Dépôt traité avec succès',
      userId: 'user789',
      details: { amount: 50000, currency: 'ar', transactionId: 'tx123' }
    },
    {
      id: '5',
      timestamp: '2024-12-10T15:10:00Z',
      level: 'debug',
      category: 'system',
      message: 'Sauvegarde automatique effectuée',
      details: { backupSize: '2.5GB', duration: '5m 30s' }
    },
    {
      id: '6',
      timestamp: '2024-12-10T15:05:00Z',
      level: 'error',
      category: 'security',
      message: 'Tentative d\'accès non autorisé détectée',
      ipAddress: '192.168.1.102',
      details: { blocked: true, reason: 'Too many failed attempts' }
    }
  ];

  const filteredLogs = logs.filter(log => {
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory;
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (log.userId && log.userId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (log.ipAddress && log.ipAddress.includes(searchTerm));
    return matchesLevel && matchesCategory && matchesSearch;
  });

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'info': return Info;
      case 'warning': return AlertTriangle;
      case 'error': return XCircle;
      case 'debug': return FileText;
      default: return Info;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'debug': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'system': return Server;
      case 'user': return User;
      case 'security': return Shield;
      case 'database': return Database;
      case 'transaction': return CheckCircle;
      default: return FileText;
    }
  };

  const exportLogs = (format: 'json' | 'csv' | 'txt') => {
    // Simulation d'export
    console.log(`Exporting logs in ${format} format`);
  };

  const clearLogs = () => {
    // Simulation de suppression
    console.log('Clearing logs');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logs Système</h1>
          <p className="text-gray-600">Surveillez et analysez les activités de votre plateforme</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => exportLogs('json')}>
            <Download className="h-4 w-4 mr-2" />
            JSON
          </Button>
          <Button variant="outline" onClick={() => exportLogs('csv')}>
            <Download className="h-4 w-4 mr-2" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => exportLogs('txt')}>
            <Download className="h-4 w-4 mr-2" />
            TXT
          </Button>
          <Button variant="outline" onClick={clearLogs} className="text-red-600 hover:text-red-700">
            <Trash2 className="h-4 w-4 mr-2" />
            Vider
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Logs</p>
              <p className="text-2xl font-bold text-blue-900">{logs.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Info</p>
              <p className="text-2xl font-bold text-green-900">
                {logs.filter(log => log.level === 'info').length}
              </p>
            </div>
            <Info className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-600 font-medium">Avertissements</p>
              <p className="text-2xl font-bold text-yellow-900">
                {logs.filter(log => log.level === 'warning').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-600 font-medium">Erreurs</p>
              <p className="text-2xl font-bold text-red-900">
                {logs.filter(log => log.level === 'error').length}
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
                placeholder="Rechercher dans les logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76] focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#006B76]"
            >
              <option value="all">Tous les niveaux</option>
              <option value="info">Info</option>
              <option value="warning">Avertissement</option>
              <option value="error">Erreur</option>
              <option value="debug">Debug</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#006B76]"
            >
              <option value="all">Toutes les catégories</option>
              <option value="system">Système</option>
              <option value="user">Utilisateur</option>
              <option value="security">Sécurité</option>
              <option value="database">Base de données</option>
              <option value="transaction">Transaction</option>
            </select>
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>
      </Card>

      {/* Logs List */}
      <Card>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredLogs.map((log) => {
            const LevelIcon = getLevelIcon(log.level);
            const CategoryIcon = getCategoryIcon(log.category);
            return (
              <div key={log.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`p-2 rounded-lg ${getLevelColor(log.level)}`}>
                      <LevelIcon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="p-1 rounded bg-gray-100">
                          <CategoryIcon className="h-4 w-4 text-gray-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{log.message}</h3>
                        <StatusBadge 
                          status={log.level} 
                          className={getLevelColor(log.level)}
                        />
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-gray-500 mb-2">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(log.timestamp).toLocaleString('fr-FR')}
                        </span>
                        {log.userId && (
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" />
                            {log.userId}
                          </span>
                        )}
                        {log.ipAddress && (
                          <span className="flex items-center">
                            <Shield className="h-3 w-3 mr-1" />
                            {log.ipAddress}
                          </span>
                        )}
                      </div>
                      {log.details && (
                        <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                          <pre className="whitespace-pre-wrap">{JSON.stringify(log.details, null, 2)}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowDetails(showDetails === log.id ? null : log.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {showDetails === log.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Détails complets</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>ID:</strong> {log.id}</div>
                      <div><strong>Timestamp:</strong> {log.timestamp}</div>
                      <div><strong>Niveau:</strong> {log.level}</div>
                      <div><strong>Catégorie:</strong> {log.category}</div>
                      {log.userId && <div><strong>Utilisateur:</strong> {log.userId}</div>}
                      {log.ipAddress && <div><strong>IP:</strong> {log.ipAddress}</div>}
                      {log.userAgent && <div><strong>User Agent:</strong> {log.userAgent}</div>}
                      {log.details && (
                        <div>
                          <strong>Détails:</strong>
                          <pre className="mt-1 text-xs bg-white p-2 rounded border">
                            {JSON.stringify(log.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredLogs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>Aucun log trouvé</p>
              <p className="text-sm mt-1">Essayez de modifier vos filtres</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}