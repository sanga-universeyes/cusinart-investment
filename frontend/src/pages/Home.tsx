import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-[#006B76]">CUIZ Investment</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-[#006B76] font-medium"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="bg-[#006B76] text-white px-4 py-2 rounded-lg hover:bg-[#006B76]/90 transition-colors"
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Investissez avec{' '}
              <span className="text-[#006B76]">Confiance</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Rejoignez la plateforme d'investissement la plus fiable de Madagascar. 
              Gagnez des revenus quotidiens avec nos plans d'investissement garantis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-[#006B76] text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#006B76]/90 transition-colors"
              >
                Commencer maintenant
              </Link>
              <Link
                to="/faq"
                className="border border-[#006B76] text-[#006B76] px-8 py-3 rounded-lg text-lg font-semibold hover:bg-[#006B76] hover:text-white transition-colors"
              >
                En savoir plus
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pourquoi choisir CUIZ Investment ?
            </h2>
            <p className="text-xl text-gray-600">
              Une plateforme complète pour vos investissements
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#006B76] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Rendements Garantis
              </h3>
              <p className="text-gray-600">
                Profitez de rendements quotidiens garantis avec nos plans d'investissement 
                CUIZ 1-4, de 0.5% à 2% par jour.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#006B76] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Système de Parrainage
              </h3>
              <p className="text-gray-600">
                Gagnez des commissions sur 3 niveaux en parrainant vos amis et 
                construisez votre équipe.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-[#006B76] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Micro-tâches Rémunérées
              </h3>
              <p className="text-gray-600">
                Complétez des tâches simples et gagnez des points que vous pouvez 
                échanger contre de l'argent.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Nos Plans d'Investissement
            </h2>
            <p className="text-xl text-gray-600">
              Choisissez le plan qui correspond à vos objectifs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'CUIZ 1',
                dailyReturn: '0.5%',
                duration: '30 jours',
                minAmount: '10,000 Ar',
                maxAmount: '50,000 Ar',
                totalReturn: '15%',
                popular: false,
              },
              {
                name: 'CUIZ 2',
                dailyReturn: '0.8%',
                duration: '60 jours',
                minAmount: '50,000 Ar',
                maxAmount: '200,000 Ar',
                totalReturn: '48%',
                popular: true,
              },
              {
                name: 'CUIZ 3',
                dailyReturn: '1.2%',
                duration: '90 jours',
                minAmount: '200,000 Ar',
                maxAmount: '1,000,000 Ar',
                totalReturn: '108%',
                popular: false,
              },
              {
                name: 'CUIZ 4',
                dailyReturn: '2.0%',
                duration: '120 jours',
                minAmount: '1,000,000 Ar',
                maxAmount: '10,000,000 Ar',
                totalReturn: '240%',
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`bg-white rounded-xl shadow-lg p-6 ${
                  plan.popular ? 'ring-2 ring-[#006B76]' : ''
                }`}
              >
                {plan.popular && (
                  <div className="bg-[#006B76] text-white text-sm font-semibold px-3 py-1 rounded-full text-center mb-4">
                    Populaire
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-[#006B76] mb-4">
                  {plan.dailyReturn}
                </div>
                <div className="space-y-2 text-sm text-gray-600 mb-6">
                  <p>Durée: {plan.duration}</p>
                  <p>Min: {plan.minAmount}</p>
                  <p>Max: {plan.maxAmount}</p>
                  <p>Rendement total: {plan.totalReturn}</p>
                </div>
                <Link
                  to="/register"
                  className="w-full bg-[#006B76] text-white py-2 px-4 rounded-lg hover:bg-[#006B76]/90 transition-colors text-center block"
                >
                  Investir maintenant
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">CUIZ Investment</h3>
              <p className="text-gray-400">
                La plateforme d'investissement la plus fiable de Madagascar.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liens rapides</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link to="/company" className="hover:text-white">À propos</Link></li>
                <li><Link to="/register" className="hover:text-white">S'inscrire</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: support@cuiz.com</li>
                <li>Téléphone: +261 34 12 345 67</li>
                <li>WhatsApp: +261 34 12 345 67</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suivez-nous</h4>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
                <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white">Instagram</a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CUIZ Investment. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;