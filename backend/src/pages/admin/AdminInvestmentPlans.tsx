import React, { useState } from 'react';
import { 
  TrendingUp, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X,
  DollarSign,
  Percent,
  Users,
  Calendar
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../utils/currency';
import { INVESTMENT_PLANS } from '../../config/constants';
import toast from 'react-hot-toast';

interface InvestmentPlan {
  id: string;
  name: string;
  minAmount: { ar: number; usdt: number };
  maxAmount: { ar: number; usdt: number };
  minAddition: { ar: number; usdt: number };
  dailyReturn: number;
  status: 'active' | 'inactive';
  referralCommission: { level1: number; level2: number; level3: number };
  teamCommission: { level1: number; level2: number; level3: number };
  createdAt: Date;
}

export function AdminInvestmentPlans() {
  const [plans, setPlans] = useState<InvestmentPlan[]>(
    INVESTMENT_PLANS.map(plan => ({
      ...plan,
      status: 'active' as const,
      createdAt: new Date()
    }))
  );
  const [editingPlan, setEditingPlan] = useState<InvestmentPlan | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    minAmountAr: '',
    maxAmountAr: '',
    minAdditionAr: '',
    minAmountUsdt: '',
    maxAmountUsdt: '',
    minAdditionUsdt: '',
    dailyReturn: '',
    referralLevel1: '10',
    referralLevel2: '6',
    referralLevel3: '3',
    teamLevel1: '6',
    teamLevel2: '3',
    teamLevel3: '1'
  });

  const resetForm = () => {
    setFormData({
      name: '',
      minAmountAr: '',
      maxAmountAr: '',
      minAdditionAr: '',
      minAmountUsdt: '',
      maxAmountUsdt: '',
      minAdditionUsdt: '',
      dailyReturn: '',
      referralLevel1: '10',
      referralLevel2: '6',
      referralLevel3: '3',
      teamLevel1: '6',
      teamLevel2: '3',
      teamLevel3: '1'
    });
  };

  const handleEdit = (plan: InvestmentPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      minAmountAr: plan.minAmount.ar.toString(),
      maxAmountAr: plan.maxAmount.ar.toString(),
      minAdditionAr: plan.minAddition.ar.toString(),
      minAmountUsdt: plan.minAmount.usdt.toString(),
      maxAmountUsdt: plan.maxAmount.usdt.toString(),
      minAdditionUsdt: plan.minAddition.usdt.toString(),
      dailyReturn: plan.dailyReturn.toString(),
      referralLevel1: plan.referralCommission.level1.toString(),
      referralLevel2: plan.referralCommission.level2.toString(),
      referralLevel3: plan.referralCommission.level3.toString(),
      teamLevel1: plan.teamCommission.level1.toString(),
      teamLevel2: plan.teamCommission.level2.toString(),
      teamLevel3: plan.teamCommission.level3.toString()
    });
    setShowCreateForm(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.dailyReturn) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const planData: InvestmentPlan = {
      id: editingPlan?.id || `cuiz${Date.now()}`,
      name: formData.name,
      minAmount: {
        ar: parseInt(formData.minAmountAr) || 0,
        usdt: parseFloat(formData.minAmountUsdt) || 0
      },
      maxAmount: {
        ar: parseInt(formData.maxAmountAr) || 0,
        usdt: parseFloat(formData.maxAmountUsdt) || 0
      },
      minAddition: {
        ar: parseInt(formData.minAdditionAr) || 0,
        usdt: parseFloat(formData.minAdditionUsdt) || 0
      },
      dailyReturn: parseFloat(formData.dailyReturn),
      status: 'active',
      referralCommission: {
        level1: parseFloat(formData.referralLevel1),
        level2: parseFloat(formData.referralLevel2),
        level3: parseFloat(formData.referralLevel3)
      },
      teamCommission: {
        level1: parseFloat(formData.teamLevel1),
        level2: parseFloat(formData.teamLevel2),
        level3: parseFloat(formData.teamLevel3)
      },
      createdAt: editingPlan?.createdAt || new Date()
    };

    if (editingPlan) {
      setPlans(prev => prev.map(p => p.id === editingPlan.id ? planData : p));
      toast.success('Plan modifié avec succès');
    } else {
      setPlans(prev => [...prev, planData]);
      toast.success('Plan créé avec succès');
    }

    setShowCreateForm(false);
    setEditingPlan(null);
    resetForm();
  };

  const handleDelete = (planId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
      setPlans(prev => prev.filter(p => p.id !== planId));
      toast.success('Plan supprimé');
    }
  };

  const toggleStatus = (planId: string) => {
    setPlans(prev => prev.map(p => 
      p.id === planId 
        ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' }
        : p
    ));
    toast.success('Statut mis à jour');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Plans d'Investissement</h1>
          <p className="text-gray-600">{plans.length} plan(s) configuré(s)</p>
        </div>
        
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouveau Plan
        </Button>
      </div>

      {/* Formulaire de création/édition */}
      {showCreateForm && (
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">
              {editingPlan ? 'Modifier le Plan' : 'Créer un Nouveau Plan'}
            </h3>
            <Button
              variant="ghost"
              onClick={() => {
                setShowCreateForm(false);
                setEditingPlan(null);
                resetForm();
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Nom du Plan"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="CUIZ 1"
              />

              <Input
                label="Rendement Quotidien (%)"
                type="number"
                step="0.1"
                value={formData.dailyReturn}
                onChange={(e) => setFormData({...formData, dailyReturn: e.target.value})}
                placeholder="3.0"
                icon={<Percent className="h-5 w-5" />}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Min Ar"
                  type="number"
                  value={formData.minAmountAr}
                  onChange={(e) => setFormData({...formData, minAmountAr: e.target.value})}
                  placeholder="10000"
                />
                <Input
                  label="Min USDT"
                  type="number"
                  step="0.1"
                  value={formData.minAmountUsdt}
                  onChange={(e) => setFormData({...formData, minAmountUsdt: e.target.value})}
                  placeholder="2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Max Ar"
                  type="number"
                  value={formData.maxAmountAr}
                  onChange={(e) => setFormData({...formData, maxAmountAr: e.target.value})}
                  placeholder="400000"
                />
                <Input
                  label="Max USDT"
                  type="number"
                  step="0.1"
                  value={formData.maxAmountUsdt}
                  onChange={(e) => setFormData({...formData, maxAmountUsdt: e.target.value})}
                  placeholder="80"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Commissions de Parrainage (%)</h4>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Niveau 1"
                  type="number"
                  value={formData.referralLevel1}
                  onChange={(e) => setFormData({...formData, referralLevel1: e.target.value})}
                />
                <Input
                  label="Niveau 2"
                  type="number"
                  value={formData.referralLevel2}
                  onChange={(e) => setFormData({...formData, referralLevel2: e.target.value})}
                />
                <Input
                  label="Niveau 3"
                  type="number"
                  value={formData.referralLevel3}
                  onChange={(e) => setFormData({...formData, referralLevel3: e.target.value})}
                />
              </div>

              <h4 className="font-medium text-gray-900">Commissions d'Équipe (%)</h4>
              <div className="grid grid-cols-3 gap-3">
                <Input
                  label="Niveau 1"
                  type="number"
                  value={formData.teamLevel1}
                  onChange={(e) => setFormData({...formData, teamLevel1: e.target.value})}
                />
                <Input
                  label="Niveau 2"
                  type="number"
                  value={formData.teamLevel2}
                  onChange={(e) => setFormData({...formData, teamLevel2: e.target.value})}
                />
                <Input
                  label="Niveau 3"
                  type="number"
                  value={formData.teamLevel3}
                  onChange={(e) => setFormData({...formData, teamLevel3: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <Button onClick={handleSave} className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              {editingPlan ? 'Modifier' : 'Créer'}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateForm(false);
                setEditingPlan(null);
                resetForm();
              }}
              className="flex-1"
            >
              Annuler
            </Button>
          </div>
        </Card>
      )}

      {/* Liste des plans */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <Card key={plan.id} hover>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleStatus(plan.id)}
                    className={`w-3 h-3 rounded-full ${
                      plan.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  />
                  <span className="text-xs text-gray-500 capitalize">{plan.status}</span>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rendement:</span>
                  <span className="font-semibold text-green-600">{plan.dailyReturn}%/jour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min Ar:</span>
                  <span className="font-medium">{formatCurrency(plan.minAmount.ar, 'ar')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Ar:</span>
                  <span className="font-medium">{formatCurrency(plan.maxAmount.ar, 'ar')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Min USDT:</span>
                  <span className="font-medium">{formatCurrency(plan.minAmount.usdt, 'usdt')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max USDT:</span>
                  <span className="font-medium">{formatCurrency(plan.maxAmount.usdt, 'usdt')}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg">
                <h4 className="text-xs font-medium text-gray-700 mb-2">Commissions</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-600">Parrainage:</span>
                    <span className="ml-1 font-medium">
                      {plan.referralCommission.level1}/{plan.referralCommission.level2}/{plan.referralCommission.level3}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Équipe:</span>
                    <span className="ml-1 font-medium">
                      {plan.teamCommission.level1}/{plan.teamCommission.level2}/{plan.teamCommission.level3}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(plan)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(plan.id)}
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {plans.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Aucun plan d'investissement configuré</p>
          <Button onClick={() => setShowCreateForm(true)} className="mt-4">
            Créer le premier plan
          </Button>
        </div>
      )}
    </div>
  );
}