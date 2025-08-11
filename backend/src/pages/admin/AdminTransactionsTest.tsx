import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { formatCurrency } from '../../utils/currency';
import { Transaction } from '../../types';
import toast from 'react-hot-toast';

export function AdminTransactionsTest() {
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      userId: 'USR_953881',
      userName: 'Jean Rakoto',
      type: 'deposit',
      currency: 'ar',
      amount: 50000,
      status: 'pending',
      method: 'MVola',
      reference: 'DEP123456',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'TXN002',
      userId: 'USR_654321',
      userName: 'Marie Rabe',
      type: 'withdrawal',
      currency: 'ar',
      amount: 25000,
      status: 'completed',
      method: 'Airtel Money',
      reference: 'WTH789012',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const handleApprove = (transactionId: string) => {
    setTransactions(prev => 
      prev.map(t => 
        t.id === transactionId 
          ? { ...t, status: 'completed' as const }
          : t
      )
    );
    toast.success('Transaction approuvée !');
  };

  const handleReject = (transactionId: string) => {
    const reason = prompt('Raison du rejet :');
    if (reason) {
      setTransactions(prev => 
        prev.map(t => 
          t.id === transactionId 
            ? { ...t, status: 'failed' as const }
            : t
        )
      );
      toast.success('Transaction rejetée !');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Test Transactions Admin</h1>
        <p className="text-gray-600">Page de test pour vérifier le fonctionnement des transactions</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Montant
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
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.type === 'deposit' ? 'Dépôt' : 'Retrait'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(transaction.amount, transaction.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={transaction.status}>
                      {transaction.status === 'pending' ? 'En attente' :
                       transaction.status === 'completed' ? 'Terminé' : 'Échoué'}
                    </StatusBadge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {transaction.status === 'pending' && (
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(transaction.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Approuver
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(transaction.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Rejeter
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

      <Card>
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">Statistiques</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {transactions.filter(t => t.status === 'pending').length}
              </p>
              <p className="text-sm text-gray-600">En attente</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {transactions.filter(t => t.status === 'completed').length}
              </p>
              <p className="text-sm text-gray-600">Terminées</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">
                {transactions.filter(t => t.status === 'failed').length}
              </p>
              <p className="text-sm text-gray-600">Échouées</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}