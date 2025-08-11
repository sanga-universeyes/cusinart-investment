import React, { useState } from 'react';
import { Users, Copy, MessageCircle, Info, TrendingUp, Award, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generateReferralLink } from '../utils/referral';
import { formatCurrency } from '../utils/currency';
import toast from 'react-hot-toast';

interface TeamMember {
  id: string;
  name: string;
  phone: string;
  level: number;
  isInvestor: boolean;
  totalInvested: number;
  joinedAt: Date;
  referrals: number;
}

export function Team() {
  const { user } = useAuth();
  const [activeLevel, setActiveLevel] = useState<1 | 2 | 3>(1);
  const [showCommissionInfo, setShowCommissionInfo] = useState(false);

  if (!user) return null;

  // Données de démonstration
  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'Jean Rakoto',
      phone: '032 12 345 67',
      level: 1,
      isInvestor: true,
      totalInvested: 150000,
      joinedAt: new Date(2024, 10, 15),
      referrals: 3
    },
    {
      id: '2',
      name: 'Marie Rabe',
      phone: '033 98 765 43',
      level: 1,
      isInvestor: true,
      totalInvested: 75000,
      joinedAt: new Date(2024, 10, 20),
      referrals: 1
    },
    {
      id: '3',
      name: 'Paul Andry',
      phone: '034 55 666 77',
      level: 2,
      isInvestor: false,
      totalInvested: 0,
      joinedAt: new Date(2024, 11, 1),
      referrals: 0
    },
    {
      id: '4',
      name: 'Sophie Hery',
      phone: '032 88 999 00',
      level: 2,
      isInvestor: true,
      totalInvested: 200000,
      joinedAt: new Date(2024, 11, 5),
      referrals: 2
    }
  ];

  const referralLink = generateReferralLink(user.referralCode);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  const getTeamStats = () => {
    const totalMembers = teamMembers.length;
    const investors = teamMembers.filter(m => m.isInvestor).length;
    const totalInvested = teamMembers.reduce((sum, m) => sum + m.totalInvested, 0);
    
    return { totalMembers, investors, totalInvested };
  };

  const getCommissionRates = () => ({
    referral: { level1: 10, level2: 6, level3: 3 },
    team: { level1: 6, level2: 3, level3: 1 }
  });

  const filteredMembers = teamMembers.filter(m => m.level === activeLevel);
  const stats = getTeamStats();
  const commissionRates = getCommissionRates();

  return (
    <div className="w-full space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Équipe & Groupe</h1>
        <p className="text-gray-600">Gérez votre réseau de parrainage</p>
      </div>

      {/* Statistiques générales */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats.totalMembers}</p>
          <p className="text-sm text-gray-600">Inscrits total</p>
        </Card>

        <Card className="text-center">
          <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{stats.investors}</p>
          <p className="text-sm text-gray-600">Investisseurs actifs</p>
        </Card>

        <Card className="text-center">
          <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(stats.totalInvested, 'ar')}
          </p>
          <p className="text-sm text-gray-600">Volume d'équipe</p>
        </Card>
      </div>

      {/* Liens de parrainage */}
      <Card>
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-900 flex items-center">
            <Share2 className="mr-2 h-5 w-5" />
            Mes outils de parrainage
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lien d'invitation
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(referralLink, 'Lien')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code d'invitation
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={user.referralCode}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(user.referralCode, 'Code')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Informations sur les commissions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Système de commissions</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCommissionInfo(!showCommissionInfo)}
          >
            <Info className="h-4 w-4" />
          </Button>
        </div>

        {showCommissionInfo && (
          <div className="space-y-4 bg-blue-50 p-4 rounded-lg">
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Commission de parrainage (unique)</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-blue-800">Niveau 1</p>
                  <p className="text-blue-600">{commissionRates.referral.level1}%</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-blue-800">Niveau 2</p>
                  <p className="text-blue-600">{commissionRates.referral.level2}%</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-blue-800">Niveau 3</p>
                  <p className="text-blue-600">{commissionRates.referral.level3}%</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-green-900 mb-2">Commission d'équipe (quotidienne)</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="font-semibold text-green-800">Niveau 1</p>
                  <p className="text-green-600">{commissionRates.team.level1}%</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-800">Niveau 2</p>
                  <p className="text-green-600">{commissionRates.team.level2}%</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-green-800">Niveau 3</p>
                  <p className="text-green-600">{commissionRates.team.level3}%</p>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 mt-4">
              <p><strong>Commission de parrainage :</strong> Reçue une seule fois lors de l'investissement initial du filleul</p>
              <p><strong>Commission d'équipe :</strong> Reçue quotidiennement basée sur les revenus journaliers des filleuls</p>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation par niveaux */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[1, 2, 3].map(level => (
          <button
            key={level}
            onClick={() => setActiveLevel(level as any)}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all ${
              activeLevel === level
                ? 'bg-white text-[#006B76] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Niveau {level}
            <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
              {teamMembers.filter(m => m.level === level).length}
            </span>
          </button>
        ))}
      </div>

      {/* Liste des membres */}
      <div className="space-y-4">
        {filteredMembers.map(member => (
          <Card key={member.id} hover>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#006B76] to-[#006B76]/80 rounded-full flex items-center justify-center text-white font-semibold">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">{member.name}</h3>
                  <p className="text-sm text-gray-500">{member.phone}</p>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.isInvestor 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {member.isInvestor ? 'Investisseur' : 'Non-investisseur'}
                    </span>
                    <span className="text-xs text-gray-500">
                      Rejoint le {member.joinedAt.toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatCurrency(member.totalInvested, 'ar')}
                </p>
                <p className="text-sm text-gray-500">
                  {member.referrals} filleul{member.referrals > 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </Card>
        ))}

        {filteredMembers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun membre au niveau {activeLevel}</p>
            <p className="text-sm mt-2">Partagez votre lien pour recruter des filleuls !</p>
          </div>
        )}
      </div>

      {/* Groupe WhatsApp */}
      <Card className="bg-green-50 border-green-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="font-semibold text-green-900">Groupe WhatsApp Officiel</h3>
              <p className="text-sm text-green-700">
                Rejoignez notre communauté pour les dernières actualités
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => window.open('https://chat.whatsapp.com/example', '_blank')}
            className="bg-green-600 hover:bg-green-700"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Rejoindre
          </Button>
        </div>
      </Card>
    </div>
  );
}