import React, { useState } from 'react';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  Check, 
  X, 
  Eye,
  Play,
  Pause,
  Award
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';

interface MicroTask {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  description: string;
  url: string;
  type: 'like' | 'subscribe' | 'watch' | 'follow' | 'register';
  pointsReward: number;
  maxExecutions: number;
  currentExecutions: number;
  validationType: 'automatic' | 'manual';
  status: 'active' | 'inactive' | 'completed' | 'suspended';
  createdAt: Date;
}

interface TaskExecution {
  id: string;
  taskId: string;
  taskTitle: string;
  executorId: string;
  executorName: string;
  proofImage?: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
  reviewedAt?: Date;
}

export function AdminTasks() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'executions'>('tasks');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'completed' | 'suspended'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'like' | 'subscribe' | 'watch' | 'follow' | 'register'>('all');

  // Mock data
  const mockTasks: MicroTask[] = [
    {
      id: 'TASK001',
      creatorId: 'user1',
      creatorName: 'Jean Rakoto',
      title: 'Liker ma vidéo YouTube',
      description: 'Regarder et liker ma dernière vidéo sur la cuisine',
      url: 'https://youtube.com/watch?v=example1',
      type: 'like',
      pointsReward: 1,
      maxExecutions: 100,
      currentExecutions: 45,
      validationType: 'manual',
      status: 'active',
      createdAt: new Date(2024, 11, 15, 10, 0)
    },
    {
      id: 'TASK002',
      creatorId: 'user2',
      creatorName: 'Marie Rabe',
      title: 'S\'abonner à ma chaîne',
      description: 'S\'abonner à ma chaîne YouTube de recettes',
      url: 'https://youtube.com/channel/example2',
      type: 'subscribe',
      pointsReward: 2,
      maxExecutions: 50,
      currentExecutions: 12,
      validationType: 'automatic',
      status: 'active',
      createdAt: new Date(2024, 11, 16, 14, 30)
    }
  ];

  const mockExecutions: TaskExecution[] = [
    {
      id: 'EXEC001',
      taskId: 'TASK001',
      taskTitle: 'Liker ma vidéo YouTube',
      executorId: 'user3',
      executorName: 'Paul Andry',
      proofImage: 'proof1.jpg',
      status: 'pending',
      submittedAt: new Date(2024, 11, 16, 16, 20)
    },
    {
      id: 'EXEC002',
      taskId: 'TASK002',
      taskTitle: 'S\'abonner à ma chaîne',
      executorId: 'user4',
      executorName: 'Sophie Hery',
      proofImage: 'proof2.jpg',
      status: 'approved',
      submittedAt: new Date(2024, 11, 16, 15, 10),
      reviewedAt: new Date(2024, 11, 16, 15, 30)
    }
  ];

  const filteredTasks = mockTasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.creatorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesType = typeFilter === 'all' || task.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredExecutions = mockExecutions.filter(execution => {
    const matchesSearch = 
      execution.taskTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      execution.executorName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleSuspendTask = (taskId: string) => {
    const reason = window.prompt('Raison de la suspension :');
    if (reason) {
      toast.success('Tâche suspendue');
    }
  };

  const handleApproveExecution = (executionId: string) => {
    toast.success('Exécution approuvée');
  };

  const handleRejectExecution = (executionId: string) => {
    const reason = window.prompt('Raison du rejet :');
    if (reason) {
      toast.success('Exécution rejetée');
    }
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      like: 'Like',
      subscribe: 'S\'abonner',
      watch: 'Regarder',
      follow: 'Suivre',
      register: 'S\'inscrire'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const pendingExecutions = mockExecutions.filter(e => e.status === 'pending').length;
  const activeTasks = mockTasks.filter(t => t.status === 'active').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Micro-tâches</h1>
          <p className="text-gray-600">
            {activeTasks} tâche(s) active(s) • {pendingExecutions} exécution(s) en attente
          </p>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="text-center">
          <CheckSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{activeTasks}</p>
          <p className="text-sm text-gray-600">Tâches actives</p>
        </Card>

        <Card className="text-center">
          <Play className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {mockExecutions.filter(e => e.status === 'approved').length}
          </p>
          <p className="text-sm text-gray-600">Exécutions validées</p>
        </Card>

        <Card className="text-center">
          <Eye className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{pendingExecutions}</p>
          <p className="text-sm text-gray-600">En attente</p>
        </Card>

        <Card className="text-center">
          <Award className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {mockTasks.reduce((sum, t) => sum + (t.pointsReward * t.currentExecutions), 0)}
          </p>
          <p className="text-sm text-gray-600">Points distribués</p>
        </Card>
      </div>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'tasks'
              ? 'bg-white text-[#006B76] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Tâches créées ({mockTasks.length})
        </button>
        <button
          onClick={() => setActiveTab('executions')}
          className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
            activeTab === 'executions'
              ? 'bg-white text-[#006B76] shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Exécutions ({mockExecutions.length})
        </button>
      </div>

      {/* Filtres */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder={activeTab === 'tasks' ? "Rechercher une tâche..." : "Rechercher une exécution..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5" />}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            
            {activeTab === 'tasks' && (
              <>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="completed">Terminée</option>
                  <option value="suspended">Suspendue</option>
                </select>

                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
                >
                  <option value="all">Tous les types</option>
                  <option value="like">Like</option>
                  <option value="subscribe">S'abonner</option>
                  <option value="watch">Regarder</option>
                  <option value="follow">Suivre</option>
                  <option value="register">S'inscrire</option>
                </select>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Contenu des onglets */}
      {activeTab === 'tasks' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tâche
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Créateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Progression
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Récompense
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {task.description}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {task.creatorName}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getTypeLabel(task.type)}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {task.currentExecutions}/{task.maxExecutions}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(task.currentExecutions / task.maxExecutions) * 100}%` }}
                        ></div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {task.pointsReward} pts
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={task.status}>
                        {task.status === 'active' ? 'Active' :
                         task.status === 'inactive' ? 'Inactive' :
                         task.status === 'completed' ? 'Terminée' : 'Suspendue'}
                      </StatusBadge>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => window.open(task.url, '_blank')}
                          className="text-blue-600 hover:text-blue-900"
                          title="Voir le lien"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {task.status === 'active' && (
                          <button
                            onClick={() => handleSuspendTask(task.id)}
                            className="text-yellow-600 hover:text-yellow-900"
                            title="Suspendre"
                          >
                            <Pause className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'executions' && (
        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tâche
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Exécutant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Preuve
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
                {filteredExecutions.map((execution) => (
                  <tr key={execution.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {execution.taskTitle}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {execution.executorName}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {execution.proofImage && (
                        <button className="text-blue-600 hover:text-blue-900">
                          <Eye className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={execution.status}>
                        {execution.status === 'pending' ? 'En attente' :
                         execution.status === 'approved' ? 'Approuvée' : 'Rejetée'}
                      </StatusBadge>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {execution.submittedAt.toLocaleDateString('fr-FR')}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {execution.status === 'pending' && (
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveExecution(execution.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectExecution(execution.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}