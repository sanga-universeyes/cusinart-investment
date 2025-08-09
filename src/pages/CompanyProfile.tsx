import React from 'react';
import { Building, Target, Shield, Award } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { brandConfig } from '../config/brand';

export function CompanyProfile() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Profil Entreprise</h1>
        <p className="text-gray-600">Découvrez {brandConfig.name}</p>
      </div>

      {/* Header avec logo */}
      <Card className="text-center bg-gradient-to-r from-[#006B76] to-[#006B76]/80 text-white">
        <div className="space-y-4">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto">
            <Building className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold">{brandConfig.name}</h2>
          <p className="text-xl opacity-90">"Savor the Good Life."</p>
        </div>
      </Card>

      {/* À propos */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Building className="mr-2 h-6 w-6 text-[#006B76]" />
            À propos de l'entreprise
          </h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 leading-relaxed">
              <strong>Cuisinart Investa</strong> est une plateforme d'investissement moderne et sécurisée 
              qui révolutionne la façon dont les Malgaches investissent et font fructifier leur argent.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Nous combinons la tradition culinaire de Cuisinart avec l'innovation financière 
              pour offrir des opportunités d'investissement accessibles à tous, des débutants 
              aux investisseurs expérimentés.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Notre plateforme propose des plans d'investissement diversifiés (CUIZ 1 à 7), 
              un système de parrainage généreux, et des micro-tâches rémunérées pour 
              maximiser vos revenus.
            </p>
          </div>
        </div>
      </Card>

      {/* Politique */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Shield className="mr-2 h-6 w-6 text-[#006B76]" />
            Politique de l'entreprise
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🔒 Sécurité et Transparence</h4>
              <p className="text-gray-700">
                Nous garantissons la sécurité de vos fonds grâce à un système de cryptage avancé 
                et une validation manuelle de toutes les transactions importantes.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">⚡ Paiements Rapides</h4>
              <p className="text-gray-700">
                Les revenus quotidiens sont crédités automatiquement, et les retraits 
                sont traités sous 12h maximum, 5 jours sur 7.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">🤝 Support Client</h4>
              <p className="text-gray-700">
                Notre équipe support est disponible via WhatsApp et email pour vous 
                accompagner dans votre parcours d'investissement.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">📱 Accessibilité Mobile</h4>
              <p className="text-gray-700">
                Plateforme optimisée pour mobile avec interface intuitive et 
                navigation simplifiée pour tous les niveaux d'utilisateurs.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Objectifs */}
      <Card>
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <Target className="mr-2 h-6 w-6 text-[#006B76]" />
            Objectifs de l'entreprise
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#006B76]/10 rounded-full flex items-center justify-center mt-1">
                  <span className="text-[#006B76] font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Démocratiser l'Investissement</h4>
                  <p className="text-sm text-gray-600">
                    Rendre l'investissement accessible à tous les Malgaches, 
                    quel que soit leur niveau de revenu ou d'expérience.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#006B76]/10 rounded-full flex items-center justify-center mt-1">
                  <span className="text-[#006B76] font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Créer une Communauté</h4>
                  <p className="text-sm text-gray-600">
                    Bâtir un réseau d'investisseurs solidaires qui s'entraident 
                    et partagent les opportunités.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#006B76]/10 rounded-full flex items-center justify-center mt-1">
                  <span className="text-[#006B76] font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Innovation Technologique</h4>
                  <p className="text-sm text-gray-600">
                    Utiliser la technologie pour simplifier l'investissement 
                    et offrir une expérience utilisateur exceptionnelle.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-[#006B76]/10 rounded-full flex items-center justify-center mt-1">
                  <span className="text-[#006B76] font-bold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Croissance Durable</h4>
                  <p className="text-sm text-gray-600">
                    Assurer une croissance stable et durable pour tous nos 
                    investisseurs sur le long terme.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Valeurs */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="text-center space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Nos Valeurs</h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: 'Sécurité', desc: 'Protection maximale de vos fonds' },
              { icon: Award, title: 'Excellence', desc: 'Service de qualité supérieure' },
              { icon: Users, title: 'Communauté', desc: 'Esprit d\'équipe et solidarité' },
              { icon: Target, title: 'Performance', desc: 'Rendements attractifs et durables' }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                  <value.icon className="h-8 w-8 text-[#006B76]" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{value.title}</h4>
                <p className="text-sm text-gray-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Contact */}
      <Card className="bg-[#006B76] text-white">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">Contactez-nous</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Support WhatsApp</h4>
              <p className="text-sm opacity-90">+261 34 69 53 881</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Email</h4>
              <p className="text-sm opacity-90">support@cuisinart-investa.com</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}