import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, User, Mail, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { brandConfig } from '../config/brand';
import { validatePhoneNumber } from '../utils/referral';
import toast from 'react-hot-toast';

export function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    referredBy: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.password) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!validatePhoneNumber(formData.phone)) {
      toast.error('Numéro de téléphone invalide');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setIsLoading(true);
      await register(formData);
      toast.success('Inscription réussie ! Bienvenue !');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Erreur lors de l\'inscription');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold" style={{ color: brandConfig.colors.primary }}>
            {brandConfig.name}
          </h1>
          <p className="text-gray-600 mt-2">Créez votre compte d'investissement</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label={t('firstName')}
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jean"
                icon={<User className="h-5 w-5" />}
                required
              />

              <Input
                label={t('lastName')}
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Dupont"
                icon={<User className="h-5 w-5" />}
                required
              />
            </div>

            <Input
              label={t('phone')}
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="032 XX XXX XX"
              icon={<Phone className="h-5 w-5" />}
              required
            />

            <Input
              label={t('email')}
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="jean@example.com (optionnel)"
              icon={<Mail className="h-5 w-5" />}
            />

            <Input
              label={t('referralCode')}
              name="referredBy"
              value={formData.referredBy}
              onChange={handleChange}
              placeholder="Code de parrainage (optionnel)"
              icon={<Users className="h-5 w-5" />}
            />

            <Input
              label={t('password')}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              icon={<Lock className="h-5 w-5" />}
              required
            />

            <Input
              label={t('confirmPassword')}
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              icon={<Lock className="h-5 w-5" />}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              {t('register')}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-center text-sm text-gray-600 mb-4">
              <p>🎁 <strong>Bonus de bienvenue :</strong> 1000 points offerts !</p>
            </div>
            
            <p className="text-center text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link
                to="/login"
                className="font-medium hover:underline"
                style={{ color: brandConfig.colors.primary }}
              >
                Se connecter
              </Link>
            </p>
            
            <div className="mt-4 text-center">
              <Link
                to="/"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}