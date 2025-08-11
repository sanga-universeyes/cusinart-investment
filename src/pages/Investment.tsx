import React, { useState } from 'react';
import { 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Award, 
  CheckCircle,
  ArrowRight,
  Plus,
  History,
  BarChart3,
  Target,
  Zap,
  Shield,
  Star,
  Calendar,
  Users,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatCurrency } from '../utils/currency';
import { useNavigate } from 'react-router-dom';

interface InvestmentPlan {
  id: string;
  name: string;
  description: string;
  minAmount: number;
  maxAmount: number;
  dailyReturn: number;
  duration: number;
  totalReturn: number;
  features: string[];
  isPopular?: boolean;
  isRecommended?: boolean;
  status: 'active' | 'inactive';
}

interface ActiveInvestment {
  id: string;
  planName: string;
  amount: number;
  dailyReturn: number;
  totalEarned: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'paused';
  progress: number;
}

export function Investment() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState<InvestmentPlan | null>(null);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState('');

  // Plans d'investissement
  const investmentPlans: InvestmentPlan[] = [
    {
      id: '1',
      name: 'CUIZ 1',
      description: 'Plan d\'entrée idéal pour débuter vos investissements',
      minAmount: 50000,
      maxAmount: 500000,
      dailyReturn: 3,
      duration: 30,
      totalReturn: 90,
      features: ['Rendement quotidien garanti', 'Support 24/7', 'Retrait flexible'],
      status: 'active'
    },
    {
      id: '2',
      name: 'CUIZ 2',
      description: 'Plan intermédiaire avec des rendements optimisés',
      minAmount: 100000,
      maxAmount: 2000000,
      dailyReturn: 3.5,
      duration: 60,
      totalReturn: 210,
      features: ['Rendement quotidien garanti', 'Support prioritaire', 'Bonus de parrainage'],
      isPopular: true,
      status: 'active'
    },
    {
      id: '3',
      name: 'CUIZ 3',
      description: 'Plan premium pour investisseurs expérimentés',
      minAmount: 500000,
      maxAmount: 10000000,
      dailyReturn: 4,
      duration: 90,
      totalReturn: 360,
      features: ['Rendement quotidien garanti', 'Support VIP', 'Bonus exclusifs', 'Accès prioritaire'],
      isRecommended: true,
      status: 'active'
    },
    {
      id: '4',
      name: 'CUIZ 4',
      description: 'Plan expert avec les meilleurs rendements',
      minAmount: 1000000,
      maxAmount: 50000000,
      dailyReturn: 5,
      duration: 120,
      totalReturn: 600,
      features: ['Rendement quotidien garanti', 'Support dédié', 'Bonus VIP', 'Accès exclusif'],
      status: 'active'
    }
  ];

  // Investissements actifs
  const activeInvestments: ActiveInvestment[] = [
    {
      id: '1',
      planName: 'CUIZ 2',
      amount: 200000,
      dailyReturn: 7000,
      totalEarned: 140000,
      startDate: '2024-12-01',
      endDate: '2025-01-30',
      status: 'active',
      progress: 45
    },
    {
      id: '2',
      planName: 'CUIZ 1',
      amount: 100000,
      dailyReturn: 3000,
      totalEarned: 75000,
      startDate: '2024-11-15',
      endDate: '2024-12-15',
      status: 'active',
      progress: 75
    }
  ];

  const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalDailyReturn = activeInvestments.reduce((sum, inv) => sum + inv.dailyReturn, 0);
  const totalEarned = activeInvestments.reduce((sum, inv) => sum + inv.totalEarned, 0);

  const handleInvest = () => {
    if (!selectedPlan || !investmentAmount) return;
    
    const amount = parseFloat(investmentAmount);
    if (amount < selectedPlan.minAmount || amount > selectedPlan.maxAmount) {
      alert(`Le montant doit être entre ${formatCurrency(selectedPlan.minAmount, 'ar')} et ${formatCurrency(selectedPlan.maxAmount, 'ar')}`);
      return;
    }

    // Simulation d'investissement
    console.log(`Investissement de ${amount} dans le plan ${selectedPlan.name}`);
    setShowInvestModal(false);
    setSelectedPlan(null);
    setInvestmentAmount('');
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#006B76] via-[#006B76]/90 to-[#006B76]/80 rounded-2xl p-6 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Centre d'Investissement 💰
            </h1>
            <p className="opacity-90 text-sm md:text-base">
              Choisissez votre plan et commencez à générer des revenus passifs
            </p>
          </div>
          <div className="text-right">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <TrendingUp className="h-8 w-8 md:h-10 md:w-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Total Investi</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(totalInvested, 'ar')}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Revenus/Jour</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(totalDailyReturn, 'ar')}
              </p>
            </div>
            <Activity className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">Total Gagné</p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(totalEarned, 'ar')}
              </p>
            </div>
            <Award className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-600 font-medium">Investissements</p>
              <p className="text-2xl font-bold text-orange-900">
                {activeInvestments.length}
              </p>
            </div>
            <Target className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Plans d'Investissement */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Star className="mr-2 h-6 w-6 text-yellow-500" />
          Plans d'Investissement Disponibles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {investmentPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative overflow-hidden hover:shadow-lg transition-all cursor-pointer ${
                selectedPlan?.id === plan.id ? 'ring-2 ring-[#006B76]' : ''
              }`}
              onClick={() => setSelectedPlan(plan)}
            >
              {plan.isPopular && (
                <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                  Populaire
                </div>
              )}
              {plan.isRecommended && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg">
                  Recommandé
                </div>
              )}
              
              <div className="text-center p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rendement/jour:</span>
                    <span className="font-bold text-green-600">{plan.dailyReturn}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Durée:</span>
                    <span className="font-bold text-gray-900">{plan.duration} jours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Rendement total:</span>
                    <span className="font-bold text-purple-600">{plan.totalReturn}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Min:</span>
                    <span className="font-bold text-gray-900">{formatCurrency(plan.minAmount, 'ar')}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Max:</span>
                    <span className="font-bold text-gray-900">{formatCurrency(plan.maxAmount, 'ar')}</span>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPlan(plan);
                    setShowInvestModal(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Investir
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Investissements Actifs */}
      {activeInvestments.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <History className="mr-2 h-6 w-6 text-blue-500" />
            Mes Investissements Actifs
          </h2>
          <div className="space-y-4">
            {activeInvestments.map((investment) => (
              <Card key={investment.id} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{investment.planName}</h3>
                      <p className="text-sm text-gray-600">
                        Investi: {formatCurrency(investment.amount, 'ar')}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={investment.status} />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Revenus/jour</p>
                    <p className="font-bold text-green-600">
                      {formatCurrency(investment.dailyReturn, 'ar')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total gagné</p>
                    <p className="font-bold text-purple-600">
                      {formatCurrency(investment.totalEarned, 'ar')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Début</p>
                    <p className="font-bold text-gray-900">
                      {new Date(investment.startDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Fin</p>
                    <p className="font-bold text-gray-900">
                      {new Date(investment.endDate).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progression</span>
                    <span>{investment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${investment.progress}%` }}
                    ></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Modal d'Investissement */}
      {showInvestModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Investir dans {selectedPlan.name}</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Montant à investir (AR)
                </label>
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder={`Min: ${formatCurrency(selectedPlan.minAmount, 'ar')}`}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Min: {formatCurrency(selectedPlan.minAmount, 'ar')} - Max: {formatCurrency(selectedPlan.maxAmount, 'ar')}
                </p>
              </div>

              {investmentAmount && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Résumé de l'investissement</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Montant investi:</span>
                      <span className="font-bold">{formatCurrency(parseFloat(investmentAmount), 'ar')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rendement quotidien:</span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(parseFloat(investmentAmount) * (selectedPlan.dailyReturn / 100), 'ar')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rendement total ({selectedPlan.duration} jours):</span>
                      <span className="font-bold text-purple-600">
                        {formatCurrency(parseFloat(investmentAmount) * (selectedPlan.totalReturn / 100), 'ar')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => setShowInvestModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleInvest} disabled={!investmentAmount}>
                <TrendingUp className="h-4 w-4 mr-2" />
                Confirmer l'Investissement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}