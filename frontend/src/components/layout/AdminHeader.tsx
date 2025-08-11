import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface AdminHeaderProps {
  onMenuClick: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({ onMenuClick }) => {
  const { admin } = useAuth();

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
            Administration Panel
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {admin && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#006B76] rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {admin.username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-900">
                {admin.username}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;