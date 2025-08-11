import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon Profil</h1>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-[#006B76] rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">
                {user?.firstName?.charAt(0)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">{user?.phone}</p>
              <p className="text-sm text-gray-500">
                Membre depuis {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations du compte</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <p className="mt-1 text-gray-900">{user?.firstName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <p className="mt-1 text-gray-900">{user?.lastName}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <p className="mt-1 text-gray-900">{user?.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user?.email || 'Non renseigné'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Code de parrainage</label>
            <p className="mt-1 text-gray-900">{user?.referralCode}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <p className="mt-1">
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user?.status === 'active' ? 'bg-green-100 text-green-800' :
                user?.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {user?.status === 'active' ? 'Actif' :
                 user?.status === 'inactive' ? 'Inactif' :
                 user?.status === 'suspended' ? 'Suspendu' : 'Banni'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;