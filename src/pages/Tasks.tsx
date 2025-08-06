import React, { useState, useEffect } from 'react';
import { Plus, Play, Eye, Check, X, Clock, Award, Target } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { formatCurrency } from '../utils/currency';
import { EXCHANGE_RATES } from '../config/constants';
import toast from 'react-hot-toast';

interface MicroTask {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  url: string;
  type: 'like' | 'subscribe' | 'watch' | 'follow' | 'register';
  pointsReward: number;
  maxExecutions: number;
  currentExecutions: number;
  validationType: 'automatic' | 'manual';
  status: 'active' | 'inactive' | 'completed';
  createdAt: Date;
}

interface TaskExecution {
  id: string;
  taskId: string;
  executorId: string;
  proofImage?: File;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

export function Tasks() {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'create' | 'execute' | 'validate'>('execute');
  const [tasks, setTasks] = useState<MicroTask[]>([]);
  const [myTasks, setMyTasks] = useState<MicroTask[]>([]);
  const [executions, setExecutions] = useState<TaskExecution[]>([]);
  const [timer, setTimer] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentTask, setCurrentTask] = useState<MicroTask | null>(null);
  const [proofImage, setProofImage] = useState<File | null>(null);

  // Formulaire de création de tâche
  const [taskForm, setTaskForm] = useState({
    title: '',
    url: '',
    type: 'like' as MicroTask['type'],
    executors: '',
    pointsReward: '',
    description: '',
    validationType: 'manual' as 'automatic' | 'manual'
  });

  if (!user) return null;

  // Timer pour l'exécution des tâches
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isExecuting && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isExecuting, timer]);

  const handleCreateTask = async () => {
    const pointsNeeded = parseInt(taskForm.pointsReward) * parseInt(taskForm.executors);
    
    if (pointsNeeded > user.pointsBalance) {
      toast.error('Points insuffisants pour créer cette mission');
      return;
    }

    if (!taskForm.title || !taskForm.url || !taskForm.pointsReward || !taskForm.executors) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      const newTask: MicroTask = {
        id: Date.now().toString(),
        creatorId: user.id,
        title: taskForm.title,
        description: taskForm.description,
        url: taskForm.url,
        type: taskForm.type,
        pointsReward: parseInt(taskForm.pointsReward),
        maxExecutions: parseInt(taskForm.executors),
        currentExecutions: 0,
        validationType: taskForm.validationType,
        status: 'active',
        createdAt: new Date()
      };

      setMyTasks(prev => [...prev, newTask]);
      setTasks(prev => [...prev, newTask]);

      // Débiter les points
      updateUser({ pointsBalance: user.pointsBalance - pointsNeeded });

      addNotification({
        type: 'points',
        title: 'Mission créée',
        message: `Mission "${taskForm.title}" créée avec succès`,
        status: 'success',
        amount: pointsNeeded,
        currency: 'points'
      });

      toast.success('Mission créée avec succès !');
      
      // Reset form
      setTaskForm({
        title: '',
        url: '',
        type: 'like',
        executors: '',
        pointsReward: '',
        description: '',
        validationType: 'manual'
      });

    } catch (error) {
      toast.error('Erreur lors de la création');
    }
  };

  const handleExecuteTask = (task: MicroTask) => {
    setCurrentTask(task);
    setTimer(EXCHANGE_RATES.TASK_TIMER_SECONDS);
    setIsExecuting(true);
    
    // Ouvrir le lien dans un nouvel onglet
    window.open(task.url, '_blank');
  };

  const handleSubmitExecution = async () => {
    if (!currentTask || !proofImage) {
      toast.error('Veuillez téléverser une capture d\'écran');
      return;
    }

    if (timer > 0) {
      toast.error(`Attendez encore ${timer} secondes`);
      return;
    }

    try {
      const execution: TaskExecution = {
        id: Date.now().toString(),
        taskId: currentTask.id,
        executorId: user.id,
        proofImage,
        status: currentTask.validationType === 'automatic' ? 'approved' : 'pending',
        submittedAt: new Date()
      };

      setExecutions(prev => [...prev, execution]);

      if (currentTask.validationType === 'automatic') {
        // Créditer automatiquement les points
        updateUser({ pointsBalance: user.pointsBalance + currentTask.pointsReward });
        
        addNotification({
          type: 'points',
          title: 'Mission terminée',
          message: `+${currentTask.pointsReward} points pour "${currentTask.title}"`,
          status: 'success',
          amount: currentTask.pointsReward,
          currency: 'points'
        });

        toast.success(`+${currentTask.pointsReward} points gagnés !`);
      } else {
        toast.success('Mission soumise pour validation');
      }

      // Reset
      setCurrentTask(null);
      setIsExecuting(false);
      setProofImage(null);
      setTimer(0);

    } catch (error) {
      toast.error('Erreur lors de la soumission');
    }
  };

  const handleValidateExecution = (executionId: string, approved: boolean) => {
    const execution = executions.find(e => e.id === executionId);
    const task = tasks.find(t => t.id === execution?.taskId);
    
    if (!execution || !task) return;

    setExecutions(prev => 
      prev.map(e => 
        e.id === executionId 
          ? { ...e, status: approved ? 'approved' : 'rejected' }
          : e
      )
    );

    if (approved) {
      // Créditer les points à l'exécutant (simulation)
      toast.success(`Mission validée : +${task.pointsReward} points`);
    } else {
      toast.success('Mission rejetée');
    }
  };

  const getTaskTypeLabel = (type: MicroTask['type']) => {
    const labels = {
      like: 'Like',
      subscribe: 'S\'abonner',
      watch: 'Regarder',
      follow: 'Suivre',
      register: 'S\'inscrire'
    };
    return labels[type];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Micro-tâches</h1>
        <p className="text-gray-600">Créez des missions ou gagnez des points</p>
      </div>

      {/* Statistiques */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(user.pointsBalance, 'points')}
          </p>
          <p className="text-sm text-gray-600">Mes points</p>
        </Card>

        <Card className="text-center">
          <Target className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{myTasks.length}</p>
          <p className="text-sm text-gray-600">Missions créées</p>
        </Card>

        <Card className="text-center">
          <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {executions.filter(e => e.status === 'approved').length}
          </p>
          <p className="text-sm text-gray-600">Missions terminées</p>
        </Card>
      </div>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'execute', label: 'Faire des missions', icon: Play },
          { key: 'create', label: 'Créer une mission', icon: Plus },
          { key: 'validate', label: 'Valider missions', icon: Eye }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#006B76] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'execute' && (
        <div className="space-y-6">
          {isExecuting && currentTask ? (
            <Card>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-[#006B76] text-white rounded-full flex items-center justify-center mx-auto">
                  <span className="text-2xl font-bold">{timer}</span>
                </div>
                
                <h3 className="text-lg font-semibold">{currentTask.title}</h3>
                <p className="text-gray-600">{currentTask.description}</p>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">Lien de la mission :</p>
                  <a 
                    href={currentTask.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {currentTask.url}
                  </a>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléverser la capture d'écran
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofImage(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#006B76] file:text-white hover:file:bg-[#006B76]/80"
                  />
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleSubmitExecution}
                    disabled={timer > 0 || !proofImage}
                    className="flex-1"
                  >
                    {timer > 0 ? `Attendre ${timer}s` : 'Valider'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsExecuting(false);
                      setCurrentTask(null);
                      setTimer(0);
                      setProofImage(null);
                    }}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {tasks.filter(t => t.status === 'active' && t.creatorId !== user.id).map(task => (
                <Card key={task.id} hover>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        +{task.pointsReward} pts
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600">{task.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Type: {getTaskTypeLabel(task.type)}</span>
                      <span>{task.currentExecutions}/{task.maxExecutions}</span>
                    </div>
                    
                    <Button
                      onClick={() => handleExecuteTask(task)}
                      size="sm"
                      className="w-full"
                      disabled={task.currentExecutions >= task.maxExecutions}
                    >
                      <Play className="mr-2 h-4 w-4" />
                      Exécuter
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <Card>
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Créer une mission</h3>
              <p className="text-sm text-gray-600">
                Points disponibles: {formatCurrency(user.pointsBalance, 'points')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Titre de la mission"
                value={taskForm.title}
                onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                placeholder="Ex: Liker ma vidéo YouTube"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de mission
                </label>
                <select
                  value={taskForm.type}
                  onChange={(e) => setTaskForm({...taskForm, type: e.target.value as any})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50 focus:border-[#006B76]"
                >
                  <option value="like">Like</option>
                  <option value="subscribe">S'abonner</option>
                  <option value="watch">Regarder une vidéo</option>
                  <option value="follow">Suivre une page</option>
                  <option value="register">S'inscrire sur un site</option>
                </select>
              </div>
            </div>

            <Input
              label="Lien à promouvoir"
              value={taskForm.url}
              onChange={(e) => setTaskForm({...taskForm, url: e.target.value})}
              placeholder="https://youtube.com/watch?v=..."
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="Nombre d'exécutants souhaités"
                type="number"
                value={taskForm.executors}
                onChange={(e) => setTaskForm({...taskForm, executors: e.target.value})}
                placeholder="100"
              />

              <Input
                label="Points par exécutant"
                type="number"
                value={taskForm.pointsReward}
                onChange={(e) => setTaskForm({...taskForm, pointsReward: e.target.value})}
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description de la mission
              </label>
              <textarea
                value={taskForm.description}
                onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50 focus:border-[#006B76]"
                placeholder="Décrivez ce que les utilisateurs doivent faire..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type de validation
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="manual"
                    checked={taskForm.validationType === 'manual'}
                    onChange={(e) => setTaskForm({...taskForm, validationType: e.target.value as any})}
                    className="mr-2"
                  />
                  Validation manuelle
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="automatic"
                    checked={taskForm.validationType === 'automatic'}
                    onChange={(e) => setTaskForm({...taskForm, validationType: e.target.value as any})}
                    className="mr-2"
                  />
                  Validation automatique
                </label>
              </div>
            </div>

            {taskForm.executors && taskForm.pointsReward && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Coût total:</strong> {parseInt(taskForm.executors || '0') * parseInt(taskForm.pointsReward || '0')} points
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={handleCreateTask}
                className="flex-1"
                disabled={!taskForm.title || !taskForm.url || !taskForm.executors || !taskForm.pointsReward}
              >
                Créer la mission
              </Button>
              <Button
                variant="outline"
                onClick={() => setTaskForm({
                  title: '',
                  url: '',
                  type: 'like',
                  executors: '',
                  pointsReward: '',
                  description: '',
                  validationType: 'manual'
                })}
                className="flex-1"
              >
                Réinitialiser
              </Button>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'validate' && (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Missions à valider</h3>
            <p className="text-sm text-gray-600">
              {executions.filter(e => e.status === 'pending').length} missions en attente
            </p>
          </div>

          <div className="space-y-4">
            {executions
              .filter(e => e.status === 'pending')
              .map(execution => {
                const task = tasks.find(t => t.id === execution.taskId);
                if (!task) return null;

                return (
                  <Card key={execution.id}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Soumis le {execution.submittedAt.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          size="sm"
                          onClick={() => handleValidateExecution(execution.id, true)}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleValidateExecution(execution.id, false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}

            {executions.filter(e => e.status === 'pending').length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune mission en attente de validation</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}