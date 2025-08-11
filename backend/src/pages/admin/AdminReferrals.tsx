import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Copy, 
  Eye,
  TrendingUp,
  Award,
  Link as LinkIcon
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';

interface ReferralData {
  id: string;
  userName: string;
  phone: string;
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  activeReferrals: number;
  totalCommissions: number;
  level1Count: number;
  level2Count: number;
  level3Count: number;
  createdAt: Date;
}

export function AdminReferrals() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'referrals' | 'commissions' | 'date'>('referrals');

  // Mock data
  const mockReferrals: ReferralData[] = [
    {
      id: 'user1',
      userName: 'Jean Rakoto',
      phone: '+261346953881',
      referralCode: 'USR_953881',
      referralLink: 'https://cuisinart-investa.com/register?ref=USR_953881',
      totalReferrals: 15,
      activeReferrals: 12,
      totalCommissions: 125000,
      level1Count: 8,
      level2Count: 5,
      level3Count: 2,
      createdAt: new Date(2024, 10, 15)
    },
    {
      id: 'user2',
      userName: 'Marie Rabe',
      phone: '+261337654321',
      referralCode: 'USR_654321',
      referralLink: 'https://cuisinart-investa.com/register?ref=USR_654321',
      totalReferrals: 8,
      activeReferrals: 6,
      totalCommissions: 75000,
      level1Count: 4,
      level2Count: 3,
      level3Count: 1,
      createdAt: new Date(2024, 11, 1)
    }
  ];

  const filteredReferrals = mockReferrals
    .filter(referral => 
      referral.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.referralCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.phone.includes(searchTerm)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'referrals':
          return b.totalReferrals - a.totalReferrals;
        case 'commissions':
          return b.totalCommissions - a.totalCommissions;
        case 'date':
          return b.createdAt.getTime() - a.createdAt.getTime();
        default:
          return 0;
      }
    });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié !`);
  };

  const totalStats = {
    totalReferrals: mockReferrals.reduce((sum, r) => sum + r.totalReferrals, 0),
    activeReferrals: mockReferrals.reduce((sum, r) => sum + r.activeReferrals, 0),
    totalCommissions: mockReferrals.reduce((sum, r) => sum + r.totalCommissions, 0)
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Parrainage & Affiliés</h1>
          <p className="text-gray-600">
            {totalStats.totalReferrals} parrainages • {totalStats.activeReferrals} actifs
          </p>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="text-center">
          <Users className="h-8 w-8 text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{totalStats.totalReferrals}</p>
          <p className="text-sm text-gray-600">Total Parrainages</p>
        </Card>

        <Card className="text-center">
          <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">{totalStats.activeReferrals}</p>
          <p className="text-sm text-gray-600">Parrainages Actifs</p>
        </Card>

        <Card className="text-center">
          <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(totalStats.totalCommissions, 'ar')}
          </p>
          <p className="text-sm text-gray-600">Commissions Totales</p>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Rechercher par nom, code ou téléphone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="h-5 w-5" />}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50"
            >
              <option value="referrals">Trier par parrainages</option>
              <option value="commissions">Trier par commissions</option>
              <option value="date">Trier par date</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Liste des parrainages */}
      <div className="grid gap-6">
        {filteredReferrals.map(referral => (
          <Card key={referral.id} hover>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#006B76] to-[#006B76]/80 rounded-full flex items-center justify-center text-white font-semibold">
                    {referral.userName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{referral.userName}</h3>
                    <p className="text-sm text-gray-500">{referral.phone}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lg font-bold text-[#006B76]">
                    {referral.totalReferrals} parrainages
                  </p>
                  <p className="text-sm text-gray-500">
                    {referral.activeReferrals} actifs
                  </p>
                </div>
              </div>

              {/* Statistiques par niveau */}
              <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">{referral.level1Count}</p>
                  <p className="text-xs text-gray-600">Niveau 1</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">{referral.level2Count}</p>
                  <p className="text-xs text-gray-600">Niveau 2</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-purple-600">{referral.level3Count}</p>
                  <p className="text-xs text-gray-600">Niveau 3</p>
                </div>
              </div>

              {/* Informations de parrainage */}
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Code de parrainage
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={referral.referralCode}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm font-mono"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(referral.referralCode, 'Code')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lien de parrainage
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={referral.referralLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(referral.referralLink, 'Lien')}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Footer avec commissions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <p className="text-sm text-gray-600">Commissions totales</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(referral.totalCommissions, 'ar')}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Détails
                  </Button>
                  <Button size="sm" variant="outline">
                    <LinkIcon className="h-4 w-4 mr-1" />
                    Réseau
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}

        {filteredReferrals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun parrainage trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}