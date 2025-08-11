import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            ☰
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            CUIZ Investment
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#006B76] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user.firstName.charAt(0)}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-900">
                {user.firstName} {user.lastName}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;