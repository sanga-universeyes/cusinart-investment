# CUIZ Investment Frontend

Frontend React pour la plateforme d'investissement CUIZ avec système de parrainage, micro-tâches rémunérées et gestion multi-devises.

## 🚀 Fonctionnalités

### Interface Utilisateur
- **Dashboard interactif** avec statistiques en temps réel
- **Système d'investissement** avec plans CUIZ 1-4
- **Gestion des dépôts/retraits** via Mobile Money et USDT
- **Système de parrainage** à 3 niveaux
- **Micro-tâches rémunérées** avec système de points
- **Gestion multi-devises** (Ariary et USDT)
- **Interface responsive** optimisée mobile/desktop
- **Notifications en temps réel**
- **Historique complet** des transactions

### Interface Admin
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

## 🛠️ Technologies

- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool et dev server
- **React Router** - Navigation SPA
- **Tailwind CSS** - Framework CSS
- **Lucide React** - Icônes
- **React Hot Toast** - Notifications
- **Socket.io Client** - Communication temps réel

## 📦 Installation

### Prérequis
- Node.js >= 18.0.0
- npm >= 9.0.0
- Backend CUIZ en cours d'exécution

### Installation des dépendances
```bash
cd frontend
npm install
```

### Configuration
```bash
cp .env.example .env
# Modifier les variables d'environnement selon votre configuration
```

### Démarrage en développement
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:5173`

## 🏗️ Structure du Projet

```
frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── ui/             # Composants UI de base
│   │   └── layout/         # Composants de mise en page
│   ├── contexts/           # Contextes React
│   ├── pages/              # Pages de l'application
│   │   └── admin/          # Pages d'administration
│   ├── utils/              # Utilitaires et helpers
│   ├── types/              # Types TypeScript
│   └── config/             # Configuration
├── public/                 # Assets statiques
├── dist/                   # Build de production
└── package.json
```

## 🔧 Scripts Disponibles

- `npm run dev` - Démarrage du serveur de développement
- `npm run build` - Build de production
- `npm run preview` - Prévisualisation du build
- `npm run lint` - Vérification du code
- `npm run lint:fix` - Correction automatique du code
- `npm run type-check` - Vérification des types TypeScript
- `npm run test` - Exécution des tests
- `npm run format` - Formatage du code

## 🌐 API Backend

Le frontend communique avec le backend via l'API REST et WebSocket :

- **API REST** : `http://localhost:3000/api`
- **WebSocket** : `ws://localhost:8080`

### Endpoints Principaux

- `POST /api/auth/login` - Connexion utilisateur
- `POST /api/auth/register` - Inscription utilisateur
- `GET /api/users/profile` - Profil utilisateur
- `POST /api/transactions/deposit` - Créer un dépôt
- `POST /api/transactions/withdrawal` - Créer un retrait
- `GET /api/investments/plans` - Plans d'investissement
- `POST /api/investments/create` - Créer un investissement
- `GET /api/tasks` - Liste des tâches
- `POST /api/tasks/:id/complete` - Compléter une tâche

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Docker
```bash
npm run docker:build
npm run docker:run
```

### Vercel
```bash
npm run deploy:vercel
```

### Netlify
```bash
npm run deploy:netlify
```

## 🔒 Sécurité

- Authentification JWT
- Validation des données côté client
- Protection CSRF
- Headers de sécurité
- Rate limiting côté serveur

## 📱 Responsive Design

L'interface est optimisée pour :
- **Mobile** : 320px - 768px
- **Tablet** : 768px - 1024px
- **Desktop** : 1024px+

## 🎨 Thème et Design

- **Couleur principale** : #006B76 (bleu-vert)
- **Couleur secondaire** : #FF6B35 (orange)
- **Police** : Inter (Google Fonts)
- **Design System** : Tailwind CSS

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Email** : support@cuiz.com
- **WhatsApp** : +261 34 12 345 67
- **Documentation** : [docs.cuiz.com](https://docs.cuiz.com)

## 🔗 Liens Utiles

- [Backend Repository](../backend)
- [Documentation API](../backend/README.md)
- [Déploiement](../README.md#deployment)
