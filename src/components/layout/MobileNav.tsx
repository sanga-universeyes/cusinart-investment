import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, TrendingUp, Wallet, CreditCard, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { brandConfig } from '../../config/brand';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Tableau', sublabel: 'de bord' },
  { to: '/deposit', icon: Wallet, label: 'Dépôt', sublabel: 'Recharger' },
  { to: '/withdraw', icon: CreditCard, label: 'Retrait', sublabel: 'Retirer' },
  { to: '/invest', icon: TrendingUp, label: 'Achat', sublabel: 'Investir' },
  { to: '/profile', icon: User, label: 'Mon', sublabel: 'Profil' }
];

export function MobileNav() {
  const { t } = useLanguage();
  const { unreadCount } = useNotifications();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-200 z-50 shadow-2xl">
      <div className="grid grid-cols-5 h-20 px-1">
        {navItems.map((item, index) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center p-2 transition-all duration-300 rounded-2xl mx-1 my-2 relative
              ${isActive
                ? `text-white bg-gradient-to-br from-[${brandConfig.colors.primary}] to-[${brandConfig.colors.primary}]/80 shadow-xl transform scale-105`
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100 active:scale-95'
              }
            `}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <div className="text-center">
              <span className="text-xs font-bold leading-tight">{item.label}</span>
              <span className="text-xs leading-tight block">{item.sublabel}</span>
            </div>
            
            {/* Notification badge pour dashboard */}
            {item.to === '/dashboard' && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 block h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}