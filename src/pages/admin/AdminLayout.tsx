import React, { useState } from 'react';
import { Outlet, useNavigate, NavLink } from 'react-router-dom';
import { 
  LayoutDashboard,
  Users,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  History,
  TrendingUp,
  Award,
  Settings,
  UserCheck,
  Shield,
  FileText,
  CheckSquare,
  LogOut,
  Menu,
  X,
  Bell,
  BarChart3,
  FileText as FileTextIcon
} from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { brandConfig } from '../../config/brand';

const menuItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/admin/users', icon: Users, label: 'Utilisateurs' },
  { to: '/admin/deposits', icon: ArrowDownRight, label: 'Dépôts' },
  { to: '/admin/withdrawals', icon: ArrowUpRight, label: 'Retraits' },
  { to: '/admin/points-exchange', icon: RefreshCw, label: 'Échange Points' },
  { to: '/admin/transactions', icon: History, label: 'Transactions' },
  { to: '/admin/investment-plans', icon: TrendingUp, label: 'Plans Investissement' },
  { to: '/admin/commissions', icon: Award, label: 'Gains/Commissions' },
  { to: '/admin/tasks', icon: CheckSquare, label: 'Micro-tâches' },
  { to: '/admin/referrals', icon: UserCheck, label: 'Parrainage/Affiliés' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { to: '/admin/reports', icon: BarChart3, label: 'Rapports' },
  { to: '/admin/logs', icon: FileTextIcon, label: 'Logs Système' },
  { to: '/admin/content', icon: FileText, label: 'Pages et Contenus' },
  { to: '/admin/settings', icon: Settings, label: 'Réglages Système' },
  { to: '/admin/security', icon: Shield, label: 'Sécurité' }
];

export function AdminLayout() {
  const { admin, logoutAdmin } = useAdmin();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  if (!admin) {
    navigate('/admin/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Menu Toggle */}
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="text-xl font-bold ml-2" style={{ color: brandConfig.colors.primary }}>
                {brandConfig.name} - Admin
              </h1>
            </div>

            {/* Admin Profile */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#006B76] to-[#006B76]/80 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {admin.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">{admin.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{admin.role.replace('_', ' ')}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-md"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0 mt-16 lg:mt-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex flex-col h-full pt-4">
            <nav className="flex-1 px-4 space-y-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-gradient-to-r from-[#006B76] to-[#006B76]/80 text-white shadow-lg'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0 p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}