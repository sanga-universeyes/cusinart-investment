import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { to: '/dashboard', label: 'Tableau de bord', icon: '📊' },
    { to: '/investment', label: 'Investissements', icon: '💰' },
    { to: '/deposit', label: 'Dépôt', icon: '📥' },
    { to: '/withdraw', label: 'Retrait', icon: '📤' },
    { to: '/history', label: 'Historique', icon: '📋' },
    { to: '/tasks', label: 'Tâches', icon: '✅' },
    { to: '/team', label: 'Équipe', icon: '👥' },
    { to: '/buy-points', label: 'Acheter Points', icon: '🎯' },
    { to: '/exchange-points', label: 'Échanger Points', icon: '🔄' },
    { to: '/earnings', label: 'Gains', icon: '💵' },
    { to: '/profile', label: 'Profil', icon: '👤' },
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
            <h1 className="text-xl font-bold text-[#006B76]">CUIZ Investment</h1>
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* User Info */}
          {user && (
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#006B76] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.firstName.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{user.phone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
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

export default Sidebar;