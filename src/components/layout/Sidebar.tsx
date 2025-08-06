import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  Wallet, 
  CreditCard, 
  User, 
  Users, 
  CheckSquare, 
  History,
  Settings,
  HelpCircle,
  Award,
  Gift,
  PieChart,
  Target
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { brandConfig } from '../../config/brand';

const mainNavItems = [
  { to: '/dashboard', icon: Home, label: 'dashboard', primary: true },
  { to: '/invest', icon: TrendingUp, label: 'invest', primary: true },
  { to: '/deposit', icon: Wallet, label: 'deposit', primary: true },
  { to: '/withdraw', icon: CreditCard, label: 'withdraw', primary: true },
  { to: '/profile', icon: User, label: 'profile', primary: true }
];

const secondaryNavItems = [
  { to: '/tasks', icon: CheckSquare, label: 'tasks' },
  { to: '/team', icon: Users, label: 'team' },
  { to: '/history', icon: History, label: 'history' },
  { to: '/earnings', icon: Award, label: 'earnings' },
  { to: '/bonuses', icon: Gift, label: 'bonuses' },
  { to: '/analytics', icon: PieChart, label: 'analytics' },
  { to: '/goals', icon: Target, label: 'goals' },
  { to: '/settings', icon: Settings, label: 'settings' },
  { to: '/help', icon: HelpCircle, label: 'help' }
];

export function Sidebar({ isOpen }: { isOpen: boolean }) {
  const { t } = useLanguage();

  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
      lg:translate-x-0 lg:static lg:inset-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="flex flex-col h-full">
        {/* Primary Navigation */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Principal
          </h3>
          <nav className="space-y-2">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                  ${isActive
                    ? `bg-gradient-to-r from-[${brandConfig.colors.primary}] to-[${brandConfig.colors.primary}]/80 text-white shadow-lg`
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {t(item.label)}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Secondary Navigation */}
        <div className="p-4 flex-1">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Outils
          </h3>
          <nav className="space-y-1">
            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `
                  flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                  ${isActive
                    ? `bg-[${brandConfig.colors.primary}]/10 text-[${brandConfig.colors.primary}]`
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
              >
                <item.icon className="mr-3 h-4 w-4" />
                {t(item.label)}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}