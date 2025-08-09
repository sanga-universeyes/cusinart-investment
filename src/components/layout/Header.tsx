import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { brandConfig } from '../../config/brand';
import { Button } from '../ui/Button';

export function Header() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold gradient-text text-shadow">
                {brandConfig.name}
              </h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="text-sm border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#006B76]/50 bg-white shadow-md hover:shadow-lg transition-all"
            >
              <option value="mg">🇲🇬 Malagasy</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="en">🇺🇸 English</option>
            </select>

            {user && (
              <>
                {/* Notifications */}
                <button className="p-3 text-gray-400 hover:text-gray-600 relative rounded-xl hover:bg-gray-100 transition-all mobile-touch">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 block h-3 w-3 rounded-full bg-red-500 animate-pulse"></span>
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#006B76] to-[#006B76]/80 rounded-full flex items-center justify-center shadow-lg">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div className="hidden md:block">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-[#006B76] font-mono">#{user.referralCode}</p>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm" onClick={logout} className="mobile-touch">
                    <LogOut className="h-4 w-4" />
                    <span className="hidden md:inline ml-2">{t('logout')}</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}