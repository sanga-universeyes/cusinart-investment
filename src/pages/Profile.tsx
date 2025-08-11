import React, { useState } from 'react';
import { User, Camera, Eye, EyeOff, Phone, Lock, Save, X, Shield, Edit, Check } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { brandConfig } from '../config/brand';
import toast from 'react-hot-toast';

export function Profile() {
  const { user, updateUser } = useAuth();
  const { addNotification } = useNotifications();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
    withdrawal: false,
    confirmWithdrawal: false
  });
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    withdrawalPassword: '',
    confirmWithdrawalPassword: '',
    operator: 'mvola' as 'mvola' | 'airtel' | 'orange'
  });

  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  if (!user) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Photo sélectionnée !');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSave = async () => {
    try {
      // Validation des mots de passe
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        toast.error('Les nouveaux mots de passe ne correspondent pas');
        return;
      }

      if (formData.withdrawalPassword && formData.withdrawalPassword !== formData.confirmWithdrawalPassword) {
        toast.error('Les mots de passe de retrait ne correspondent pas');
        return;
      }

      // Mise à jour des informations
      const updates = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        ...(formData.withdrawalPassword && { withdrawPassword: formData.withdrawalPassword })
      };

      updateUser(updates);

      // Notification
      addNotification({
        type: 'profile',
        title: 'Profil mis à jour',
        message: 'Vos informations ont été mises à jour avec succès',
        status: 'success'
      });

      toast.success('Profil mis à jour !');
      setIsEditing(false);
      
      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        withdrawalPassword: '',
        confirmWithdrawalPassword: ''
      }));

    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon Profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et sécurité</p>
      </div>

      {/* Photo de profil et USER ID */}
      <Card className="bg-gradient-to-br from-[#006B76] to-[#006B76]/80 text-white">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20 flex items-center justify-center overflow-hidden backdrop-blur-sm shadow-2xl">
              {previewImage || user.profilePicture ? (
                <img 
                  src={previewImage || user.profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 md:w-16 md:h-16 text-white/80" />
              )}
            </div>
            <label className="absolute bottom-0 right-0 bg-white text-[#006B76] p-2 md:p-3 rounded-full cursor-pointer hover:bg-gray-100 transition-colors shadow-lg">
              <Camera className="w-4 h-4 md:w-5 md:h-5" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
          
          <div className="text-center">
            <h2 className="text-xl md:text-2xl font-bold mb-1">
              {user.firstName} {user.lastName}
            </h2>
            <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
              <p className="text-sm opacity-90">USER ID</p>
              <p className="font-mono font-bold text-lg md:text-xl">
                {user.referralCode}
              </p>
            </div>
            <div className="flex items-center justify-center space-x-4 mt-3">
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${user.isInvestor ? 'bg-green-400' : 'bg-yellow-400'} animate-pulse`}></div>
                <span className="text-xs opacity-90">
                  {user.isInvestor ? 'Investisseur' : 'Non-investisseur'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span className="text-xs opacity-90">Vérifié</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Informations personnelles */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <User className="mr-2 h-5 w-5" />
            Informations Personnelles
          </h3>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              size="sm"
            >
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Prénom"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              disabled={!isEditing}
              icon={<User className="h-5 w-5" />}
            />

            <Input
              label="Nom"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              disabled={!isEditing}
              icon={<User className="h-5 w-5" />}
            />
          </div>

          <Input
            label="Email (optionnel)"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="email@example.com"
          />

          {/* Numéro de téléphone avec opérateur */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Numéro de téléphone WhatsApp
            </label>
            <div className="flex space-x-3">
              <select
                name="operator"
                value={formData.operator}
                onChange={handleChange}
                disabled={!isEditing}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50 focus:border-[#006B76] bg-white disabled:bg-gray-50"
              >
                <option value="mvola">📱 MVola</option>
                <option value="airtel">📱 Airtel Money</option>
                <option value="orange">📱 Orange Money</option>
              </select>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="032 XX XXX XX"
                icon={<Phone className="h-5 w-5" />}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Modification des mots de passe */}
      {isEditing && (
        <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
          <div className="space-y-6">
            <h3 className="font-semibold text-red-900 flex items-center">
              <Lock className="mr-2 h-5 w-5" />
              Modifier les Mots de Passe
            </h3>
            
            {/* Mot de passe de connexion */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-red-800 border-b border-red-200 pb-2">
                Mot de passe de connexion
              </h4>
              
              <div className="relative">
                <Input
                  label="Ancien mot de passe"
                  name="currentPassword"
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleChange}
                  icon={<Lock className="h-5 w-5" />}
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Nouveau mot de passe"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    value={formData.newPassword}
                    onChange={handleChange}
                    icon={<Lock className="h-5 w-5" />}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirmer nouveau mot de passe"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    icon={<Lock className="h-5 w-5" />}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mot de passe de retrait */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-red-800 border-b border-red-200 pb-2">
                Mot de passe de retrait (sécurité renforcée)
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Mot de passe de retrait"
                    name="withdrawalPassword"
                    type={showPasswords.withdrawal ? "text" : "password"}
                    value={formData.withdrawalPassword}
                    onChange={handleChange}
                    icon={<Shield className="h-5 w-5" />}
                    placeholder="6+ caractères"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('withdrawal')}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.withdrawal ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Input
                    label="Confirmer mot de passe de retrait"
                    name="confirmWithdrawalPassword"
                    type={showPasswords.confirmWithdrawal ? "text" : "password"}
                    value={formData.confirmWithdrawalPassword}
                    onChange={handleChange}
                    icon={<Shield className="h-5 w-5" />}
                    placeholder="Répéter le mot de passe"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmWithdrawal')}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords.confirmWithdrawal ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Boutons d'action */}
      <div className="flex space-x-4">
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="flex-1"
            size="lg"
          >
            <Edit className="mr-2 h-5 w-5" />
            Modifier le profil
          </Button>
        ) : (
          <>
            <Button
              onClick={handleSave}
              className="flex-1"
              size="lg"
            >
              <Save className="mr-2 h-5 w-5" />
              Confirmer les modifications
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsEditing(false);
                setFormData({
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email || '',
                  phone: user.phone,
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                  withdrawalPassword: '',
                  confirmWithdrawalPassword: '',
                  operator: 'mvola'
                });
                setPreviewImage(null);
                setProfileImage(null);
              }}
              className="flex-1"
              size="lg"
            >
              <X className="mr-2 h-5 w-5" />
              Annuler
            </Button>
          </>
        )}
      </div>

      {/* Informations de sécurité */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <div className="flex items-start space-x-3">
          <Shield className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
          <div className="space-y-3 text-sm text-blue-800">
            <p className="font-semibold text-blue-900">🔒 Conseils de Sécurité</p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Votre mot de passe est confidentiel. <strong>Ne le partagez jamais.</strong></li>
              <li>Le mot de passe de retrait est requis pour tous les retraits.</li>
              <li>Utilisez des mots de passe forts (6+ caractères, alphanumériques).</li>
              <li>Vérifiez régulièrement vos informations de contact.</li>
              <li>Contactez le support en cas d'activité suspecte.</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Statistiques du profil */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <Check className="h-8 w-8 text-green-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-green-900">
            {new Date(user.createdAt).toLocaleDateString('fr-FR')}
          </p>
          <p className="text-sm text-green-700">Membre depuis</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <User className="h-8 w-8 text-blue-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-blue-900">
            {user.status === 'active' ? 'Actif' : 'Inactif'}
          </p>
          <p className="text-sm text-blue-700">Statut du compte</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <Phone className="h-8 w-8 text-purple-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-purple-900">
            {user.phone.slice(-4)}
          </p>
          <p className="text-sm text-purple-700">Téléphone (4 derniers)</p>
        </Card>

        <Card className="text-center bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <Lock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
          <p className="text-xl font-bold text-yellow-900">
            {user.withdrawPassword ? 'Défini' : 'Non défini'}
          </p>
          <p className="text-sm text-yellow-700">Mot de passe retrait</p>
        </Card>
      </div>
    </div>
  );
}