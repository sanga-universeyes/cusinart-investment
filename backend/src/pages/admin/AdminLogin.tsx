import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, UserPlus, Mail, Phone, Key } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { brandConfig } from '../../config/brand';
import toast from 'react-hot-toast';

export function AdminLogin() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'super_admin' | 'admin'>('super_admin');
  const { loginAdmin, loading } = useAdmin();
  const navigate = useNavigate();

  // Login form
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Register form
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    whatsapp: '',
    username: '',
    password: '',
    confirmPassword: '',
    adminRole: 'moderator',
    verificationKey: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!loginForm.username || !loginForm.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    try {
      await loginAdmin(loginForm.username, loginForm.password);
      toast.success('Connexion réussie !');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Identifiants incorrects');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (registerForm.verificationKey !== 'CUISINART_ADMIN_2024') {
      toast.error('Clé de vérification invalide');
      return;
    }

    toast.success('Demande de création de compte transmise au Super Admin');
    setMode('login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-[#006B76] to-[#006B76]/80 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Panel Administrateur</h1>
          <p className="text-gray-600 mt-2">{brandConfig.name}</p>
        </div>

        <Card>
          {/* Mode Selector */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-white text-[#006B76] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                mode === 'register'
                  ? 'bg-white text-[#006B76] shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Inscription
            </button>
          </div>

          {mode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
                <button
                  type="button"
                  onClick={() => setRole('super_admin')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    role === 'super_admin'
                      ? 'bg-white text-[#006B76] shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Super Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    role === 'admin'
                      ? 'bg-white text-[#006B76] shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Admin
                </button>
              </div>

              <Input
                label="Nom d'utilisateur"
                value={loginForm.username}
                onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
                placeholder="admin"
                icon={<User className="h-5 w-5" />}
                required
              />

              <Input
                label="Mot de passe"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5" />}
                required
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={loading}
              >
                Se connecter
              </Button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Nom complet"
                value={registerForm.fullName}
                onChange={(e) => setRegisterForm({...registerForm, fullName: e.target.value})}
                placeholder="Jean Dupont"
                icon={<User className="h-5 w-5" />}
                required
              />

              <Input
                label="Adresse email"
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                placeholder="admin@example.com"
                icon={<Mail className="h-5 w-5" />}
                required
              />

              <Input
                label="Numéro WhatsApp"
                value={registerForm.whatsapp}
                onChange={(e) => setRegisterForm({...registerForm, whatsapp: e.target.value})}
                placeholder="+261 XX XXX XX XX"
                icon={<Phone className="h-5 w-5" />}
                required
              />

              <Input
                label="Nom d'utilisateur"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                placeholder="admin_jean"
                icon={<User className="h-5 w-5" />}
                required
              />

              <Input
                label="Mot de passe"
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5" />}
                required
              />

              <Input
                label="Confirmer mot de passe"
                type="password"
                value={registerForm.confirmPassword}
                onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                placeholder="••••••••"
                icon={<Lock className="h-5 w-5" />}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rôle demandé
                </label>
                <select
                  value={registerForm.adminRole}
                  onChange={(e) => setRegisterForm({...registerForm, adminRole: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50 focus:border-[#006B76]"
                >
                  <option value="moderator">Modérateur</option>
                  <option value="support">Support Client</option>
                  <option value="finance">Admin Finance</option>
                  <option value="auditor">Auditeur</option>
                </select>
              </div>

              <Input
                label="Clé de vérification"
                value={registerForm.verificationKey}
                onChange={(e) => setRegisterForm({...registerForm, verificationKey: e.target.value})}
                placeholder="Clé fournie par le Super Admin"
                icon={<Key className="h-5 w-5" />}
                required
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Créer le compte Admin
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              Cette page est réservée aux administrateurs autorisés
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}