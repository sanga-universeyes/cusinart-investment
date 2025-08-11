import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Shield, Users, Award, Smartphone, Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { brandConfig } from '../config/brand';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export function Home() {
  const { language, setLanguage, t } = useLanguage();

  const features = [
    {
      icon: TrendingUp,
      title: "Investissements Sécurisés",
      description: "Plans d'investissement avec rendements quotidiens garantis"
    },
    {
      icon: Users,
      title: "Système de Parrainage",
      description: "Gagnez des commissions à 3 niveaux sur vos filleuls"
    },
    {
      icon: Award,
      title: "Missions et Points",
      description: "Complétez des micro-tâches et gagnez des points convertibles"
    },
    {
      icon: Shield,
      title: "Sécurité Maximale",
      description: "Vos fonds et données sont protégés par un cryptage avancé"
    }
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{ color: brandConfig.colors.primary }}>
                {brandConfig.name}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="mg">🇲🇬 Malagasy</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="en">🇺🇸 English</option>
              </select>
              
              <Link to="/login">
                <Button variant="outline" size="sm">
                  {t('login')}
                </Button>
              </Link>
              
              <Link to="/register">
                <Button variant="primary" size="sm">
                  {t('register')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Investissez et
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006B76] to-[#006B76]/80 block">
                Multipliez vos Revenus
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Plateforme d'investissement moderne avec système de parrainage, 
              micro-tâches rémunérées et gestion multi-devises (Ariary/USDT).
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  <Users className="mr-2 h-5 w-5" />
                  Commencer Maintenant
                </Button>
              </Link>
              
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Smartphone className="mr-2 h-5 w-5" />
                Télécharger l'App
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover className="text-center">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: `${brandConfig.colors.primary}20` }}
                >
                  <feature.icon 
                    className="h-6 w-6" 
                    style={{ color: brandConfig.colors.primary }} 
                  />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#006B76] to-[#006B76]/90">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">
            Rejoignez des milliers d'investisseurs
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "10,000+", label: "Utilisateurs Actifs" },
              { value: "500M Ar", label: "Volume d'Investissement" },
              { value: "15%", label: "Rendement Quotidien" },
              { value: "24/7", label: "Support Client" }
            ].map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Card padding="lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prêt à commencer votre parcours d'investissement ?
            </h2>
            <p className="text-gray-600 mb-8">
              Inscrivez-vous maintenant et recevez un bonus de bienvenue de 1000 points !
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Créer un Compte Gratuit
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <Globe className="mr-2 h-5 w-5" />
                En Savoir Plus
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">{brandConfig.name}</h3>
          <p className="text-gray-400 mb-6">
            Plateforme d'investissement sécurisée et moderne
          </p>
          <div className="flex justify-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white">Conditions d'utilisation</a>
            <a href="#" className="hover:text-white">Politique de confidentialité</a>
            <a href="#" className="hover:text-white">Support</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-800 text-sm text-gray-400">
            © 2024 {brandConfig.name}. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}