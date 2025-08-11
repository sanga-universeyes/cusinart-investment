import React, { useState } from 'react';
import { Bell, User, LogOut, Menu, X, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { brandConfig } from '../../config/brand';
import { Button } from '../ui/Button';

export function Header() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { notifications, unreadCount } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl md:text-2xl font-bold gradient-text text-shadow">
                {brandConfig.name}
              </h1>
              <p className="text-xs text-gray-500 hidden md:block">
                "Savor the Good Life."
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006B76]/50 bg-white shadow-md hover:shadow-lg transition-all"
            >
              <option value="mg">🇲🇬 MG</option>
              <option value="fr">🇫🇷 FR</option>
              <option value="en">🇺🇸 EN</option>
            </select>

            {user && (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-3 text-gray-400 hover:text-gray-600 relative rounded-xl hover:bg-gray-100 transition-all mobile-touch"
                  >
                    <Bell className="h-5 w-5 md:h-6 md:w-6" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown notifications */}
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="font-semibold text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.slice(0, 5).map(notification => (
                          <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                            <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(notification.createdAt).toLocaleString('fr-FR')}
                            </p>
                          </div>
                        ))}
                        {notifications.length === 0 && (
                          <div className="p-4 text-center text-gray-500">
                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">Aucune notification</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 md:space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#006B76] to-[#006B76]/80 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-4 w-4 md:h-5 md:w-5 text-white" />
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-[#006B76] font-mono">#{user.referralCode}</p>
                    </div>
                  </button>

                  {/* User dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#006B76] to-[#006B76]/80 rounded-full flex items-center justify-center">
                            <User className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-gray-500">{user.phone}</p>
                            <p className="text-xs text-[#006B76] font-mono">#{user.referralCode}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            window.location.href = '/profile';
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Settings className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-700">Mon Profil</span>
                        </button>
                        <button
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm">Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showUserMenu) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowNotifications(false);
            setShowUserMenu(false);
          }}
        />
      )}
    </header>
  );
}