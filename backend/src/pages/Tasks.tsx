import React, { useState, useEffect } from 'react';
import { Plus, Play, Eye, Check, X, Clock, Award, Target, Camera, Upload, Timer } from 'lucide-react';
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
  creatorName: string;
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
  executorName: string;
  proofImage?: File;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: Date;
}

export function Tasks() {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState<'execute' | 'create' | 'validate'>('execute');
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

  // Mock data pour démonstration
  useEffect(() => {
    const mockTasks: MicroTask[] = [
      {
        id: 'TASK001',
        creatorId: 'other_user',
        creatorName: 'Marie Rabe',
        title: 'Liker ma vidéo YouTube',
        description: 'Regarder et liker ma vidéo sur les recettes malgaches',
        url: 'https://youtube.com/watch?v=example1',
        type: 'like',
        pointsReward: 1,
        maxExecutions: 50,
        currentExecutions: 12,
        validationType: 'manual',
        status: 'active',
        createdAt: new Date(2024, 11, 15)
      },
      {
        id: 'TASK002',
        creatorId: 'other_user2',
        creatorName: 'Jean Rakoto',
        title: 'S\'abonner à ma chaîne',
        description: 'S\'abonner à ma chaîne de cuisine traditionnelle',
        url: 'https://youtube.com/channel/example2',
        type: 'subscribe',
        pointsReward: 2,
        maxExecutions: 30,
        currentExecutions: 8,
        validationType: 'automatic',
        status: 'active',
        createdAt: new Date(2024, 11, 16)
      }
    ];
    setTasks(mockTasks);
  }, []);

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
        id: `TASK${Date.now()}`,
        creatorId: user.id,
        creatorName: `${user.firstName} ${user.lastName}`,
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
        id: `EXEC${Date.now()}`,
        taskId: currentTask.id,
        executorId: user.id,
        executorName: `${user.firstName} ${user.lastName}`,
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
        addNotification({
          type: 'points',
          title: 'Mission soumise',
          message: `Mission "${currentTask.title}" en attente de validation`,
          status: 'pending',
          amount: currentTask.pointsReward,
          currency: 'points'
        });
        
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
    const task = myTasks.find(t => t.id === execution?.taskId);
    
    if (!execution || !task) return;

    setExecutions(prev => 
      prev.map(e => 
        e.id === executionId 
          ? { ...e, status: approved ? 'approved' : 'rejected' }
          : e
      )
    );

    if (approved) {
      toast.success(`Mission validée : +${task.pointsReward} points pour ${execution.executorName}`);
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

  const myExecutions = executions.filter(e => e.executorId === user.id);
  const pendingValidations = executions.filter(e => 
    e.status === 'pending' && 
    myTasks.some(t => t.id === e.taskId)
  );

  return (
    <div className="w-full space-y-6 pb-24 lg:pb-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Micro-tâches</h1>
        <p className="text-gray-600">Créez des missions ou gagnez des points</p>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-xl md:text-2xl font-bold text-yellow-900">
            {formatCurrency(user.pointsBalance, 'points')}
          </p>
          <p className="text-sm text-yellow-700">Mes points</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-xl md:text-2xl font-bold text-blue-900">{myTasks.length}</p>
          <p className="text-sm text-blue-700">Missions créées</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-xl md:text-2xl font-bold text-green-900">
            {myExecutions.filter(e => e.status === 'approved').length}
          </p>
          <p className="text-sm text-green-700">Terminées</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <Eye className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-xl md:text-2xl font-bold text-purple-900">{pendingValidations.length}</p>
          <p className="text-sm text-purple-700">À valider</p>
        </Card>
      </div>

      {/* Navigation par onglets */}
      <div className="flex space-x-1 bg-gray-100 rounded-xl p-1 shadow-inner">
        {[
          { key: 'execute', label: 'Faire des missions', icon: Play, count: tasks.filter(t => t.status === 'active' && t.creatorId !== user.id).length },
          { key: 'create', label: 'Créer une mission', icon: Plus, count: myTasks.length },
          { key: 'validate', label: 'Valider missions', icon: Eye, count: pendingValidations.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-2 md:px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-white text-[#006B76] shadow-lg transform scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            {tab.count > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px]">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'execute' && (
        <div className="space-y-6">
          {isExecuting && currentTask ? (
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-[#006B76] to-[#006B76]/80 text-white rounded-full flex items-center justify-center mx-auto shadow-xl">
                  <span className="text-2xl font-bold">{timer}</span>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{currentTask.title}</h3>
                  <p className="text-gray-600">{currentTask.description}</p>
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium mt-2">
                    +{currentTask.pointsReward} points
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-xl border border-blue-200">
                  <p className="text-sm text-gray-700 mb-2 font-medium">Lien de la mission :</p>
                  <a 
                    href={currentTask.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all text-sm bg-blue-50 p-2 rounded-lg block"
                  >
                    {currentTask.url}
                  </a>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Téléverser la capture d'écran de preuve
                  </label>
                  <div className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-white">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProofImage(e.target.files?.[0] || null)}
                      className="hidden"
                      id="proof-upload"
                    />
                    <label htmlFor="proof-upload" className="cursor-pointer">
                      {proofImage ? (
                        <div className="flex items-center justify-center space-x-2 text-green-600">
                          <Check className="h-6 w-6" />
                          <span className="font-medium">Image ajoutée: {proofImage.name}</span>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <Camera className="h-12 w-12 text-blue-400 mx-auto" />
                          <p className="text-blue-600 font-medium">
                            Cliquer pour téléverser la capture
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG jusqu'à 5MB
                          </p>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={handleSubmitExecution}
                    disabled={timer > 0 || !proofImage}
                    className="flex-1"
                    size="lg"
                  >
                    {timer > 0 ? (
                      <div className="flex items-center space-x-2">
                        <Timer className="h-4 w-4" />
                        <span>Attendre {timer}s</span>
                      </div>
                    ) : 'Valider la mission'}
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
                    size="lg"
                  >
                    Annuler
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Missions Disponibles</h3>
                <p className="text-gray-600">Exécutez des missions et gagnez des points</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.filter(t => t.status === 'active' && t.creatorId !== user.id).map(task => (
                  <Card key={task.id} hover className="bg-gradient-to-br from-white to-gray-50">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                          <p className="text-xs text-gray-500">Par {task.creatorName}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full font-medium">
                            +{task.pointsReward} pts
                          </span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.validationType === 'automatic' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {task.validationType === 'automatic' ? 'Auto' : 'Manuel'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Type: {getTaskTypeLabel(task.type)}</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 w-20">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all" 
                              style={{ width: `${(task.currentExecutions / task.maxExecutions) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {task.currentExecutions}/{task.maxExecutions}
                          </span>
                        </div>
                      </div>
                      
                      <Button
                        onClick={() => handleExecuteTask(task)}
                        size="sm"
                        className="w-full"
                        disabled={task.currentExecutions >= task.maxExecutions}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        {task.currentExecutions >= task.maxExecutions ? 'Terminé' : 'Exécuter'}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {tasks.filter(t => t.status === 'active' && t.creatorId !== user.id).length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Target className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Aucune mission disponible</p>
                  <p className="text-sm mt-2">Revenez plus tard ou créez vos propres missions</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <Card>
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Créer une Mission</h3>
              <p className="text-gray-600">
                Points disponibles: <span className="font-bold text-[#006B76]">{formatCurrency(user.pointsBalance, 'points')}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50 focus:border-[#006B76] bg-white"
                >
                  <option value="like">👍 Like</option>
                  <option value="subscribe">📺 S'abonner</option>
                  <option value="watch">▶️ Regarder une vidéo</option>
                  <option value="follow">👥 Suivre une page</option>
                  <option value="register">📝 S'inscrire sur un site</option>
                </select>
              </div>
            </div>

            <Input
              label="Lien à promouvoir"
              value={taskForm.url}
              onChange={(e) => setTaskForm({...taskForm, url: e.target.value})}
              placeholder="https://youtube.com/watch?v=..."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50 focus:border-[#006B76] resize-none"
                placeholder="Décrivez ce que les utilisateurs doivent faire..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type de validation
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="manual"
                    checked={taskForm.validationType === 'manual'}
                    onChange={(e) => setTaskForm({...taskForm, validationType: e.target.value as any})}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Validation manuelle</p>
                    <p className="text-sm text-gray-600">Vous validez chaque exécution</p>
                  </div>
                </label>
                <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="radio"
                    value="automatic"
                    checked={taskForm.validationType === 'automatic'}
                    onChange={(e) => setTaskForm({...taskForm, validationType: e.target.value as any})}
                    className="mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Validation automatique</p>
                    <p className="text-sm text-gray-600">Points crédités immédiatement</p>
                  </div>
                </label>
              </div>
            </div>

            {taskForm.executors && taskForm.pointsReward && (
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-yellow-900">Coût total de la mission</p>
                    <p className="text-sm text-yellow-700">
                      {taskForm.executors} exécutants × {taskForm.pointsReward} points
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-yellow-800">
                    {parseInt(taskForm.executors || '0') * parseInt(taskForm.pointsReward || '0')} points
                  </p>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                onClick={handleCreateTask}
                className="flex-1"
                size="lg"
                disabled={!taskForm.title || !taskForm.url || !taskForm.executors || !taskForm.pointsReward}
              >
                <Plus className="mr-2 h-5 w-5" />
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
                size="lg"
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
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Missions à Valider</h3>
            <p className="text-gray-600">
              {pendingValidations.length} mission(s) en attente de votre validation
            </p>
          </div>

          <div className="space-y-4">
            {pendingValidations.map(execution => {
              const task = myTasks.find(t => t.id === execution.taskId);
              if (!task) return null;

              return (
                <Card key={execution.id} className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Exécutant: {execution.executorName}</span>
                          <span>Récompense: {task.pointsReward} points</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          {execution.submittedAt.toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-xs text-gray-500">
                          {execution.submittedAt.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    
                    {execution.proofImage && (
                      <div className="bg-white p-3 rounded-lg border border-yellow-200">
                        <p className="text-sm text-gray-700 mb-2">Preuve soumise:</p>
                        <div className="bg-gray-100 p-4 rounded-lg text-center">
                          <Camera className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">{execution.proofImage.name}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleValidateExecution(execution.id, true)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        size="lg"
                      >
                        <Check className="mr-2 h-5 w-5" />
                        Valider
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleValidateExecution(execution.id, false)}
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                        size="lg"
                      >
                        <X className="mr-2 h-5 w-5" />
                        Rejeter
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}

            {pendingValidations.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium">Aucune mission en attente</p>
                <p className="text-sm mt-2">Les nouvelles soumissions apparaîtront ici</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mes missions créées */}
      {myTasks.length > 0 && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Target className="mr-2 h-5 w-5 text-blue-500" />
              Mes Missions Créées
            </h3>
            <span className="text-sm text-gray-500">{myTasks.length} mission(s)</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myTasks.map(task => (
              <div key={task.id} className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-medium text-blue-900">{task.title}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    task.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {task.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700">Progression:</span>
                  <span className="font-medium text-blue-900">
                    {task.currentExecutions}/{task.maxExecutions}
                  </span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all" 
                    style={{ width: `${(task.currentExecutions / task.maxExecutions) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}