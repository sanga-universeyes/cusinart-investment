import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { apiService } from '../utils/api';
import { formatCurrency } from '../utils/currency';
import { User } from '../types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, transactionsResponse] = await Promise.all([
          apiService.getStats(),
          apiService.getTransactions({ limit: 5 }),
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }

        if (transactionsResponse.success) {
          setRecentTransactions(transactionsResponse.data?.transactions || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006B76]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#006B76] to-[#006B76]/80 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bonjour, {user?.firstName} {user?.lastName} ! 👋
        </h1>
        <p className="text-[#006B76]/90">
          Bienvenue sur votre tableau de bord CUIZ Investment
        </p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Solde Ariary</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(user?.balanceAr || 0, 'ar')}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Solde USDT</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(user?.balanceUsdt || 0, 'usdt')}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">💎</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(user?.pointsBalance || 0, 'points')}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Investi</p>
              <p className="text-2xl font-bold text-[#006B76]">
                {formatCurrency(stats.totalInvested || 0, 'ar')}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Gagné</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(stats.totalEarned || 0, 'ar')}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Total Retiré</p>
              <p className="text-2xl font-bold text-orange-600">
                {formatCurrency(stats.totalWithdrawn || 0, 'ar')}
              </p>
            </div>
          </div>

          <div className="card">
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Membres Équipe</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.teamMembers || 0}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Actions Rapides
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <span className="text-2xl mb-2">📥</span>
            <span className="text-sm font-medium text-gray-700">Dépôt</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <span className="text-2xl mb-2">📤</span>
            <span className="text-sm font-medium text-gray-700">Retrait</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
            <span className="text-2xl mb-2">💰</span>
            <span className="text-sm font-medium text-gray-700">Investir</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
            <span className="text-2xl mb-2">✅</span>
            <span className="text-sm font-medium text-gray-700">Tâches</span>
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Transactions Récentes
          </h2>
          <button className="text-[#006B76] hover:text-[#006B76]/80 text-sm font-medium">
            Voir tout
          </button>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#006B76] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">
                      {transaction.type === 'deposit' ? '📥' : 
                       transaction.type === 'withdrawal' ? '📤' : 
                       transaction.type === 'investment' ? '💰' : '💳'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 capitalize">
                      {transaction.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'deposit' || transaction.type === 'investment' 
                      ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'deposit' || transaction.type === 'investment' ? '+' : '-'}
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </p>
                  <p className={`text-sm ${
                    transaction.status === 'completed' ? 'text-green-600' :
                    transaction.status === 'pending' ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {transaction.status === 'completed' ? 'Complété' :
                     transaction.status === 'pending' ? 'En attente' :
                     'Échoué'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <span className="text-4xl mb-4 block">📋</span>
            <p className="text-gray-500">Aucune transaction récente</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;