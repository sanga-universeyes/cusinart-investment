import React, { useState } from 'react';
import { User, Camera, Eye, EyeOff, Phone, Lock, Save, X } from 'lucide-react';
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
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mon Profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et sécurité</p>
      </div>

      <Card>
        <div className="space-y-6">
          {/* Photo de profil */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {previewImage || user.profilePicture ? (
                  <img 
                    src={previewImage || user.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-[#006B76] text-white p-2 rounded-full cursor-pointer hover:bg-[#006B76]/80 transition-colors">
                <Camera className="w-4 h-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            
            {/* USER ID */}
            <div className="text-center">
              <p className="text-sm text-gray-600">USER ID</p>
              <p className="font-mono font-bold text-lg text-[#006B76]">
                {user.referralCode}
              </p>
            </div>
          </div>

          {/* Informations personnelles */}
          <div className="grid md:grid-cols-2 gap-4">
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
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="email@example.com (optionnel)"
          />

          {/* Numéro de téléphone avec opérateur */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Numéro de téléphone
            </label>
            <div className="flex space-x-3">
              <select
                name="operator"
                value={formData.operator}
                onChange={handleChange}
                disabled={!isEditing}
                className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006B76]/50 focus:border-[#006B76] bg-white"
              >
                <option value="mvola">MVola</option>
                <option value="airtel">Airtel Money</option>
                <option value="orange">Orange Money</option>
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

          {/* Modification des mots de passe */}
          {isEditing && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="font-semibold text-gray-900">Modifier les mots de passe</h3>
              
              {/* Mot de passe de connexion */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Mot de passe de connexion</h4>
                
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

              {/* Mot de passe de retrait */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700">Mot de passe de retrait</h4>
                
                <div className="relative">
                  <Input
                    label="Mot de passe de retrait"
                    name="withdrawalPassword"
                    type={showPasswords.withdrawal ? "text" : "password"}
                    value={formData.withdrawalPassword}
                    onChange={handleChange}
                    icon={<Lock className="h-5 w-5" />}
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
                    icon={<Lock className="h-5 w-5" />}
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
          )}

          {/* Boutons d'action */}
          <div className="flex space-x-4 pt-6 border-t">
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="flex-1"
              >
                <User className="mr-2 h-5 w-5" />
                Modifier le profil
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSave}
                  className="flex-1"
                >
                  <Save className="mr-2 h-5 w-5" />
                  Confirmer
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
                  }}
                  className="flex-1"
                >
                  <X className="mr-2 h-5 w-5" />
                  Annuler
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Informations de sécurité */}
      <Card className="bg-blue-50 border-blue-200">
        <div className="space-y-2 text-sm text-blue-800">
          <p><strong>🔒 Sécurité :</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Votre mot de passe est confidentiel. Ne le partagez jamais.</li>
            <li>Le mot de passe de retrait est requis pour tous les retraits.</li>
            <li>Utilisez des mots de passe forts (6+ caractères, alphanumériques).</li>
            <li>Vérifiez régulièrement vos informations de contact.</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}