import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  AlertTriangle, 
  Eye,
  Ban,
  Unlock,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';

interface SecurityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  ip: string;
  userAgent: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityAlert {
  id: string;
  type: 'failed_login' | 'suspicious_activity' | 'large_transaction' | 'multiple_accounts';
  title: string;
  description: string;
  userId?: string;
  ip: string;
  timestamp: Date;
  status: 'new' | 'investigating' | 'resolved';
}

export function AdminSecurity() {
  const [activeTab, setActiveTab] = useState<'logs' | 'alerts' | 'blocked'>('logs');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all');

  // Mock security logs
  const mockLogs: SecurityLog[] = [
    {
      id: 'LOG001',
      adminId: 'admin1',
      adminName: 'Super Admin',
      action: 'approve_withdrawal',
      target: 'WTH123456',
      details: 'Retrait de 50,000 Ar approuvé pour user123',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      timestamp: new Date(2024, 11, 16, 14, 30),
      severity: 'medium'
    },
    {
      id: 'LOG002',
      adminId: 'admin2',
      adminName: 'Admin Finance',
      action: 'add_funds',
      target: 'user456',
      details: 'Ajout manuel de 25,000 Ar - Correction erreur système',
      ip: '192.168.1.101',
      userAgent: 'Mozilla/5.0...',
      timestamp: new Date(2024, 11, 16, 15, 45),
      severity: 'high'
    },
    {
      id: 'LOG003',
      adminId: 'admin1',
      adminName: 'Super Admin',
      action: 'suspend_user',
      target: 'user789',
      details: 'Suspension pour activité suspecte',
      ip: '192.168.1.100',
      userAgent: 'Mozilla/5.0...',
      timestamp: new Date(2024, 11, 16, 16, 20),
      severity: 'critical'
    }
  ];

  // Mock security alerts
  const mockAlerts: SecurityAlert[] = [
    {
      id: 'ALERT001',
      type: 'failed_login',
      title: 'Tentatives de connexion échouées',
      description: '5 tentatives de connexion échouées depuis la même IP',
      ip: '45.123.456.789',
      timestamp: new Date(2024, 11, 16, 13, 20),
      status: 'new'
    },
    {
      id: 'ALERT002',
      type: 'large_transaction',
      title: 'Transaction importante',
      description: 'Retrait de 500,000 Ar demandé',
      userId: 'user123',
      ip: '192.168.1.50',
      timestamp: new Date(2024, 11, 16, 14, 15),
      status: 'investigating'
    }
  ];

  const filteredLogs = mockLogs.filter(log => {
    const matchesSearch = 
      log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAlertColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'investigating': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const newAlertsCount = mockAlerts.filter(a => a.status === 'new').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sécurité & Journalisation</h1>
          <p className="text-gray-600">
            {filteredLogs.length} log(s) • {newAlertsCount} alerte(s) nouvelle(s)
          </p>
        </div>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exporter Logs
        </Button>
      </div>

      {/* Alertes de sécurité */}
      {newAlertsCount > 0 && (
        <Card className="bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">
                {newAlertsCount} nouvelle(s) alerte(s) de sécurité
              </p>
              <p className="text-sm text-red-700">
                Vérifiez les activités suspectes et prenez les mesures nécessaires
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Navigation par onglets */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'logs', label: 'Journal d\'Activité', icon: Activity },
          { key: 'alerts', label: 'Alertes Sécurité', icon: AlertTriangle },
          { key: 'blocked', label: 'IPs Bloquées', icon: Ban }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#006B76] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
            {tab.key === 'alerts' && newAlertsCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5">
                {newAlertsCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filtres */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher dans les logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5" />}
            />
          </div>
          
          {activeTab === 'logs' && (
            <div className="flex items-center space-x-4">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
              >
                <option value="all">Toutes les sévérités</option>
                <option value="low">Faible</option>
                <option value="medium">Moyenne</option>
                <option value="high">Élevée</option>
                <option value="critical">Critique</option>
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* Contenu des onglets */}
      {activeTab === 'logs' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Admin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Détails
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Sévérité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {log.adminName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {log.adminId}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {log.action.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-gray-500">
                        Cible: {log.target}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {log.details}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(log.severity)}`}>
                        {log.severity}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.ip}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.timestamp.toLocaleDateString('fr-FR')}
                      <br />
                      {log.timestamp.toLocaleTimeString('fr-FR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {mockAlerts.map(alert => (
            <Card key={alert.id} hover>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                    alert.status === 'new' ? 'text-red-500' :
                    alert.status === 'investigating' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                  <div>
                    <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span>IP: {alert.ip}</span>
                      {alert.userId && <span>User: {alert.userId}</span>}
                      <span>{alert.timestamp.toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAlertColor(alert.status)}`}>
                    {alert.status === 'new' ? 'Nouveau' :
                     alert.status === 'investigating' ? 'En cours' : 'Résolu'}
                  </span>
                  
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {activeTab === 'blocked' && (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <Ban className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune IP bloquée actuellement</p>
            <p className="text-sm mt-2">Les IPs suspectes apparaîtront ici</p>
          </div>
        </Card>
      )}
    </div>
  );
}