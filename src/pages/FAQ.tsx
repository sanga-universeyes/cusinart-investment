import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { brandConfig } from '../config/brand';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'account' | 'investment' | 'deposit' | 'withdrawal' | 'points' | 'referral';
}

export function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const faqItems: FAQItem[] = [
    {
      id: '1',
      category: 'account',
      question: 'Comment créer un compte ?',
      answer: `1. Allez sur le site : ${brandConfig.name.toLowerCase()}.com ou cliquez sur lien d'invitation.
2. Cliquez sur "S'inscrire".
3. Remplissez les champs requis (numéro téléphone WhatsApp, mot de passe, code d'invitation).
4. Cliquez sur "Créer mon compte" ou sur connecter s'il a déjà inscrit.
La page dirigera vers l'espace membre.`
    },
    {
      id: '2',
      category: 'deposit',
      question: 'Comment faire un dépôt ?',
      answer: `Option 1 : Mobile Money
1. Cliquez sur "Déposer".
2. Sélectionnez "Mobile Money".
3. Choisissez votre opérateur : MVola, Airtel Money, Orange Money.
4. Entrez le montant à déposer.
5. Envoyez l'argent au numéro affiché.
6. Prenez une capture d'écran de confirmation du paiement (SMS mobile money).
7. Téléversez la preuve dans le formulaire.
8. Cliquez sur "Valider mon dépôt".
Traitement manuel : votre solde sera mis à jour sous 1 à 6h.

Option 2 : USDT TRC20
1. Cliquez sur "Déposer".
2. Sélectionnez "Crypto (USDT – TRC20)".
3. Copiez l'adresse du portefeuille affichée.
4. Depuis votre wallet (ex: Binance, Trust Wallet, SafePal), envoyez le montant.
5. Téléversez une capture d'écran de la transaction.
6. Pour terminer, cliquez sur "Valider mon dépôt".
Le dépôt sera confirmé après vérification manuelle sur la blockchain.`
    },
    {
      id: '3',
      category: 'investment',
      question: 'Comment acheter un plan d\'investissement ?',
      answer: `1. Une fois votre solde crédité, allez dans "Plans d'investissement".
2. Parcourez les offres disponibles : Nom du plan : CUIZ
3. Choisir parmi le plan CUIZ, allant de CUIZ 1 à 7.
4. Entrez le montant souhaité dans les limites min/max.
5. Cliquez sur "Investir".
Vous verrez votre plan actif dans votre tableau de bord.`
    },
    {
      id: '4',
      category: 'withdrawal',
      question: 'Comment demander un retrait ?',
      answer: `1. Allez dans le menu "Retraits"
2. Sélectionnez la méthode :
   Option 1: Mobile Money : entrez votre numéro + opérateur
   Option 2: USDT TRC20 : entrez votre adresse crypto
3. Indiquez le montant à retirer.
4. Entrez votre mot de passe de retrait.
5. Cliquez sur "Soumettre la demande"
Toutes les demandes sont validées manuellement pour votre sécurité.`
    },
    {
      id: '5',
      category: 'points',
      question: 'Comment fonctionnent les points ?',
      answer: `Les points servent à créer des missions rémunérées :
- Achetez des points avec votre solde
- Créez des missions (likes, abonnements, etc.)
- D'autres utilisateurs exécutent vos missions
- Vous pouvez aussi gagner des points en exécutant des missions
- Échangez vos points contre de l'argent
Taux : 1 point = 100 Ar (investisseurs) ou 10 Ar (non-investisseurs)`
    },
    {
      id: '6',
      category: 'referral',
      question: 'Comment fonctionne le parrainage ?',
      answer: `Système de parrainage à 3 niveaux :
- Votre code est généré automatiquement depuis votre numéro WhatsApp
- Partagez votre lien d'invitation
- Gagnez des commissions sur 3 niveaux :
  * Niveau 1 : 10% de l'investissement initial
  * Niveau 2 : 6% de l'investissement initial  
  * Niveau 3 : 3% de l'investissement initial
- Commissions d'équipe quotidiennes : 6%/3%/1% des revenus journaliers`
    },
    {
      id: '7',
      category: 'account',
      question: 'Comment suivre mes transactions ?',
      answer: `Consultez vos historiques dans :
- Historique des dépôts : section "Mes Dépôts"
- Historique des retraits : section "Mes Retraits"  
- Plans actifs & revenus : Tableau de bord
- Historique des gains : toutes vos commissions
- Notifications en temps réel sur le dashboard`
    },
    {
      id: '8',
      category: 'investment',
      question: 'Quels sont les rendements des plans CUIZ ?',
      answer: `Plans d'investissement disponibles :
- CUIZ 1 : 3%/jour (10 000 - 400 000 Ar)
- CUIZ 2 : 3.5%/jour (405 000 - 1 200 000 Ar)
- CUIZ 3 : 4%/jour (1 205 000 - 2 500 000 Ar)
- CUIZ 4 : 4.5%/jour (2 505 000 - 3 750 000 Ar)
- CUIZ 5 : 4.75%/jour (3 755 000 - 5 000 000 Ar)
- CUIZ 6 : 5%/jour (5 005 000 - 7 500 000 Ar)
- CUIZ 7 : 5.5%/jour (7 505 000 - 10 000 000 Ar)
Revenus crédités automatiquement chaque jour.`
    }
  ];

  const categories = [
    { key: 'all', label: 'Toutes les questions' },
    { key: 'account', label: 'Compte' },
    { key: 'deposit', label: 'Dépôts' },
    { key: 'withdrawal', label: 'Retraits' },
    { key: 'investment', label: 'Investissements' },
    { key: 'points', label: 'Points & Missions' },
    { key: 'referral', label: 'Parrainage' }
  ];

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const filteredFAQs = faqItems.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Questions Fréquentes (FAQ)
        </h1>
        <p className="text-gray-600">
          Trouvez rapidement les réponses à vos questions
        </p>
      </div>

      {/* Barre de recherche */}
      <Card>
        <Input
          placeholder="Rechercher une question..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="h-5 w-5" />}
        />
      </Card>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category.key
                ? 'bg-[#006B76] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Liste des FAQ */}
      <div className="space-y-4">
        {filteredFAQs.map(item => (
          <Card key={item.id} className="overflow-hidden">
            <button
              onClick={() => toggleExpanded(item.id)}
              className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start space-x-3">
                <HelpCircle className="h-5 w-5 text-[#006B76] mt-0.5 flex-shrink-0" />
                <h3 className="font-medium text-gray-900">{item.question}</h3>
              </div>
              {expandedItems.includes(item.id) ? (
                <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" />
              )}
            </button>
            
            {expandedItems.includes(item.id) && (
              <div className="px-6 pb-6 border-t border-gray-100">
                <div className="pt-4">
                  <div className="prose prose-sm max-w-none text-gray-700">
                    {item.answer.split('\n').map((line, index) => (
                      <p key={index} className="mb-2 last:mb-0">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucune question trouvée</p>
            <p className="text-sm mt-2">Essayez avec d'autres mots-clés</p>
          </div>
        )}
      </div>

      {/* Contact support */}
      <Card className="bg-[#006B76] text-white">
        <div className="text-center">
          <h3 className="font-semibold mb-2">Besoin d'aide supplémentaire ?</h3>
          <p className="text-sm opacity-90 mb-4">
            Notre équipe support est là pour vous aider
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.open('https://wa.me/261346953881', '_blank')}
              className="bg-white text-[#006B76] px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Contacter sur WhatsApp
            </button>
            <button
              onClick={() => window.location.href = 'mailto:support@cuisinart-investa.com'}
              className="bg-white/10 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors"
            >
              Envoyer un email
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}