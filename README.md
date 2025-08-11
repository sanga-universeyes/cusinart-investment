# CUIZ Investment Platform

Une plateforme d'investissement moderne avec système de parrainage, micro-tâches rémunérées et gestion multi-devises (Ariary/USDT).

## 🚀 Fonctionnalités

### Côté Client
- **Dashboard interactif** avec statistiques en temps réel
- **Système d'investissement** avec plans CUIZ 1-4
- **Gestion des dépôts/retraits** via Mobile Money et USDT
- **Système de parrainage** à 3 niveaux
- **Micro-tâches rémunérées** avec système de points
- **Gestion multi-devises** (Ariary et USDT)
- **Interface responsive** optimisée mobile/desktop
- **Notifications en temps réel**
- **Historique complet** des transactions

### Côté Admin
- **Dashboard administrateur** avec métriques globales
- **Gestion des utilisateurs** (CRUD complet)
- **Validation des transactions** (dépôts/retraits)
- **Gestion des plans d'investissement**
- **Système de commissions** et parrainage
- **Gestion des micro-tâches**
- **Notifications système**
- **Rapports et statistiques** avec exports
- **Logs système** pour monitoring
- **Paramètres de sécurité**

## 🛠️ Technologies Utilisées

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router v6
- **State Management**: React Context API
- **Notifications**: React Hot Toast
- **Build Tool**: Vite
- **Package Manager**: npm

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm 9+

### Installation des dépendances
```bash
npm install
```

### Variables d'environnement
Créez un fichier `.env.local` à la racine du projet :

```env
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:8080
VITE_APP_NAME=CUIZ Investment
```

### Démarrage en développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

### Build de production
```bash
npm run build
```

### Preview de production
```bash
npm run preview
```

## 📁 Structure du Projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/             # Composants UI de base
│   └── layout/         # Composants de mise en page
├── contexts/           # Contextes React
├── pages/              # Pages de l'application
│   ├── admin/          # Pages administrateur
│   └── ...             # Pages utilisateur
├── utils/              # Utilitaires et helpers
├── config/             # Configuration
├── types/              # Types TypeScript
└── i18n/               # Internationalisation
```

## 🔧 Configuration

### Configuration de la marque
Modifiez `src/config/brand.ts` pour personnaliser :
- Nom de l'application
- Couleurs principales
- Logo
- Informations de contact

### Configuration des plans d'investissement
Modifiez `src/utils/constants.ts` pour ajuster :
- Plans d'investissement
- Taux de commission
- Limites de montants
- Méthodes de paiement

## 🎨 Interface Utilisateur

### Design System
- **Couleurs principales**: #006B76 (teal)
- **Couleurs secondaires**: #FF6B35 (orange)
- **Typographie**: Inter (Google Fonts)
- **Icônes**: Lucide React
- **Animations**: Transitions CSS fluides

### Responsive Design
- **Mobile First** approach
- **Breakpoints**: 640px, 768px, 1024px, 1280px
- **Grilles adaptatives** pour tous les écrans

## 🔐 Sécurité

### Authentification
- **JWT Tokens** pour l'authentification
- **Refresh tokens** automatiques
- **Protection des routes** côté client
- **Validation des formulaires** robuste

### Validation
- **Validation côté client** avec schémas personnalisés
- **Sanitisation des données** d'entrée
- **Protection XSS** intégrée

## 📊 Fonctionnalités Avancées

### Système de Points
- **Achat de points** avec Ariary/USDT
- **Échange de points** contre argent
- **Création de micro-tâches** rémunérées
- **Taux différenciés** investisseurs/non-investisseurs

### Parrainage Multi-niveaux
- **Niveau 1**: 10% commission
- **Niveau 2**: 6% commission  
- **Niveau 3**: 3% commission
- **Suivi en temps réel** des filleuls

### Investissements
- **4 plans disponibles** (CUIZ 1-4)
- **Rendements quotidiens** garantis
- **Durées flexibles** (30-120 jours)
- **Calculs automatiques** des profits

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Serveur de Production
```bash
npm run preview
```

### Variables d'Environnement de Production
```env
VITE_API_URL=https://api.cuiz.com
VITE_WS_URL=wss://ws.cuiz.com
NODE_ENV=production
```

## 📈 Monitoring et Analytics

### Logs Système
- **Logs utilisateur** (connexions, actions)
- **Logs de sécurité** (tentatives d'accès)
- **Logs de transaction** (dépôts, retraits)
- **Logs système** (erreurs, performances)

### Rapports Admin
- **Statistiques utilisateurs** (inscriptions, activité)
- **Métriques financières** (dépôts, retraits, profits)
- **Analytics de parrainage** (conversions, commissions)
- **Exports** (PDF, Excel, CSV)

## 🔧 Maintenance

### Mise à Jour des Dépendances
```bash
npm update
npm audit fix
```

### Nettoyage du Cache
```bash
npm run clean
```

### Vérification du Code
```bash
npm run lint
npm run type-check
```

## 🤝 Contribution

### Guidelines
1. **Fork** le projet
2. **Créer** une branche feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** les changements (`git commit -m 'Add some AmazingFeature'`)
4. **Push** vers la branche (`git push origin feature/AmazingFeature`)
5. **Ouvrir** une Pull Request

### Standards de Code
- **TypeScript** strict mode
- **ESLint** configuration
- **Prettier** formatting
- **Conventional Commits**

## 📞 Support

### Contact
- **Email**: support@cuiz.com
- **Téléphone**: +261 34 12 345 67
- **WhatsApp**: +261 34 12 345 67

### Documentation
- **API Documentation**: `/docs/api`
- **User Guide**: `/docs/user-guide`
- **Admin Guide**: `/docs/admin-guide`

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- **React Team** pour l'excellent framework
- **Tailwind CSS** pour le système de design
- **Lucide** pour les icônes
- **Vite** pour l'outil de build rapide

---

**CUIZ Investment Platform** - Construit avec ❤️ pour Madagascar
