import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { admin, logout } = useAuth();

  const menuItems = [
    { to: '/admin/dashboard', label: 'Tableau de bord', icon: '📊' },
    { to: '/admin/users', label: 'Utilisateurs', icon: '👥' },
    { to: '/admin/transactions', label: 'Transactions', icon: '💳' },
    { to: '/admin/deposits', label: 'Dépôts', icon: '📥' },
    { to: '/admin/withdrawals', label: 'Retraits', icon: '📤' },
    { to: '/admin/investments', label: 'Investissements', icon: '💰' },
    { to: '/admin/tasks', label: 'Tâches', icon: '✅' },
    { to: '/admin/commissions', label: 'Commissions', icon: '🎯' },
    { to: '/admin/referrals', label: 'Parrainage', icon: '🔗' },
    { to: '/admin/reports', label: 'Rapports', icon: '📈' },
    { to: '/admin/logs', label: 'Logs', icon: '📋' },
    { to: '/admin/notifications', label: 'Notifications', icon: '🔔' },
    { to: '/admin/settings', label: 'Paramètres', icon: '⚙️' },
    { to: '/admin/security', label: 'Sécurité', icon: '🔒' },
    { to: '/admin/content', label: 'Contenu', icon: '📝' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h1 className="text-xl font-bold text-[#006B76]">Admin Panel</h1>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* Admin Info */}
          {admin && (
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#006B76] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {admin.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{admin.username}</p>
                  <p className="text-sm text-gray-500 capitalize">
                    {admin.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.to
                    ? 'bg-[#006B76] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <button
              onClick={logout}
              className="flex items-center space-x-3 w-full px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <span className="text-lg">🚪</span>
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;