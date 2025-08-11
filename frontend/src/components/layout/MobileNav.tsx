import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNav: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { to: '/dashboard', label: 'Accueil', icon: '🏠' },
    { to: '/investment', label: 'Investir', icon: '💰' },
    { to: '/tasks', label: 'Tâches', icon: '✅' },
    { to: '/team', label: 'Équipe', icon: '👥' },
    { to: '/profile', label: 'Profil', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t lg:hidden z-30">
      <div className="flex justify-around">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center py-2 px-3 flex-1 ${
              location.pathname === item.to
                ? 'text-[#006B76]'
                : 'text-gray-500'
            }`}
          >
            <span className="text-xl mb-1">{item.icon}</span>
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;