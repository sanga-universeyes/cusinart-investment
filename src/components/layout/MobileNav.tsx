import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, TrendingUp, Wallet, CreditCard, User } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { brandConfig } from '../../config/brand';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'dashboard' },
  { to: '/invest', icon: TrendingUp, label: 'invest' },
  { to: '/deposit', icon: Wallet, label: 'deposit' },
  { to: '/withdraw', icon: CreditCard, label: 'withdraw' },
  { to: '/profile', icon: User, label: 'profile' }
];

export function MobileNav() {
  const { t } = useLanguage();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center p-2 transition-all duration-200
              ${isActive
                ? `text-[${brandConfig.colors.primary}] bg-[${brandConfig.colors.primary}]/10`
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            <item.icon className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">{t(item.label)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}