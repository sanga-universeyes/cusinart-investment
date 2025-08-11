# CUIZ Investment Platform

Plateforme d'investissement moderne avec système de parrainage, micro-tâches rémunérées et gestion multi-devises (Ariary/USDT).

## 🏗️ Architecture

Ce projet est divisé en deux parties distinctes :

- **Backend** : API REST + WebSocket avec Node.js, Express, Prisma et PostgreSQL
- **Frontend** : Interface React avec TypeScript, Tailwind CSS et Vite

## 📁 Structure du Projet

```
cuiz-investment-platform/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── controllers/     # Contrôleurs API
│   │   ├── middleware/      # Middlewares Express
│   │   ├── models/          # Modèles de données
│   │   ├── routes/          # Routes API
│   │   ├── services/        # Services métier
│   │   ├── utils/           # Utilitaires
│   │   └── types/           # Types TypeScript
│   ├── prisma/              # Schéma de base de données
│   ├── package.json
│   └── README.md
├── frontend/                # Interface React
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── contexts/        # Contextes React
│   │   ├── pages/           # Pages de l'application
│   │   ├── utils/           # Utilitaires
│   │   └── types/           # Types TypeScript
│   ├── package.json
│   └── README.md
└── README.md               # Ce fichier
```

## 🚀 Démarrage Rapide

### Prérequis
- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14.0
- Redis >= 6.0 (optionnel)

### 1. Backend

```bash
# Installer les dépendances
cd backend
npm install

# Configurer la base de données
cp .env.example .env
# Modifier DATABASE_URL dans .env

# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma migrate dev

# Démarrer le serveur
npm run dev
```

Le backend sera accessible sur `http://localhost:3000`

### 2. Frontend

```bash
# Installer les dépendances
cd frontend
npm install

# Configurer l'environnement
cp .env.example .env
# Modifier VITE_API_URL si nécessaire

# Démarrer l'application
npm run dev
```

Le frontend sera accessible sur `http://localhost:5173`

## 🛠️ Technologies

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Typage statique
- **Prisma** - ORM et migrations
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **Socket.io** - Communication temps réel
- **Winston** - Logging
- **Jest** - Tests

### Frontend
- **React 18** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes
- **React Hot Toast** - Notifications

## 📊 Fonctionnalités

### Interface Utilisateur
- Dashboard interactif avec statistiques
- Système d'investissement (plans CUIZ 1-4)
- Gestion des dépôts/retraits
- Système de parrainage multi-niveaux
- Micro-tâches rémunérées
- Gestion multi-devises (Ariary/USDT)
- Notifications temps réel
- Interface responsive

### Interface Admin
- Dashboard administrateur
- Gestion des utilisateurs
- Validation des transactions
- Gestion des investissements
- Système de commissions
- Gestion des tâches
- Rapports et statistiques
- Logs système

## 🔧 Configuration

### Variables d'Environnement Backend

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cuiz_db"

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key

# Redis (optionnel)
REDIS_URL=redis://localhost:6379

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Variables d'Environnement Frontend

```env
# API
VITE_API_URL=http://localhost:3000/api
VITE_WS_URL=ws://localhost:8080

# App
VITE_APP_NAME=CUIZ Investment
VITE_BRAND_COLOR=#006B76
```

## 🗄️ Base de Données

### Modèles Principaux

- **User** - Utilisateurs et profils
- **Transaction** - Dépôts, retraits, investissements
- **Investment** - Plans et investissements actifs
- **Task** - Micro-tâches et exécutions
- **Commission** - Système de parrainage
- **Admin** - Administrateurs et permissions
- **Notification** - Notifications système

### Migration

```bash
cd backend

# Créer une nouvelle migration
npx prisma migrate dev --name add_new_feature

# Appliquer les migrations en production
npx prisma migrate deploy

# Visualiser la base de données
npx prisma studio
```

## 🧪 Tests

### Backend
```bash
cd backend
npm test
npm run test:watch
npm run test:coverage
```

### Frontend
```bash
cd frontend
npm test
npm run test:ui
```

## 🚀 Déploiement

### Docker Compose (Recommandé)

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

### Déploiement Manuel

#### Backend
```bash
cd backend
npm run build
npm start
```

#### Frontend
```bash
cd frontend
npm run build
# Servir les fichiers statiques avec nginx/apache
```

## 📈 Monitoring

### Logs
- **Backend** : Winston avec rotation des fichiers
- **Frontend** : Console et service externe

### Métriques
- **Performance** : Temps de réponse API
- **Erreurs** : Taux d'erreur par endpoint
- **Utilisateurs** : Sessions actives, nouvelles inscriptions
- **Transactions** : Volume, montants, succès/échecs

## 🔒 Sécurité

### Backend
- Validation des données avec Zod
- Rate limiting
- CORS configuré
- Headers de sécurité (Helmet)
- JWT avec refresh tokens
- Hachage des mots de passe (bcrypt)

### Frontend
- Validation côté client
- Protection XSS
- Authentification JWT
- Routes protégées
- Sanitisation des données

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Standards de Code
- **TypeScript** strict mode
- **ESLint** + **Prettier**
- **Conventional Commits**
- **Tests** pour les nouvelles fonctionnalités

## 📞 Support

- **Email** : support@cuiz.com
- **WhatsApp** : +261 34 12 345 67
- **Documentation** : [docs.cuiz.com](https://docs.cuiz.com)

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🔗 Liens Utiles

- [Documentation Backend](backend/README.md)
- [Documentation Frontend](frontend/README.md)
- [API Documentation](backend/docs/api.md)
- [Guide de Déploiement](docs/deployment.md)

---

**CUIZ Investment Platform** - Construit avec ❤️ pour Madagascar
