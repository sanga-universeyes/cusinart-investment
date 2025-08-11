# 🚀 Guide de Développement - CUIZ Investment

Ce guide vous explique comment configurer et démarrer l'application CUIZ Investment en mode développement local.

## 📋 Prérequis

- **Node.js** (version 18 ou supérieure)
- **npm** (version 9 ou supérieure)
- **Docker** et **Docker Compose**
- **Git**

## 🛠️ Installation Rapide

### Option 1: Script Automatique (Recommandé)

```bash
# Rendre le script exécutable
chmod +x start-dev.sh

# Démarrer l'application
./start-dev.sh
```

### Option 2: Installation Manuelle

#### 1. Démarrer les Services de Base

```bash
# Démarrer PostgreSQL et Redis
docker-compose -f docker-compose.dev.yml up -d postgres redis
```

#### 2. Configuration Backend

```bash
cd backend

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env

# Générer le client Prisma
npx prisma generate

# Exécuter les migrations
npx prisma migrate dev --name init

# Seeder la base de données
npm run db:seed

# Démarrer le serveur de développement
npm run dev
```

#### 3. Configuration Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

## 🌐 Accès aux Services

Une fois démarrés, vous pouvez accéder aux services suivants :

- **Frontend** : http://localhost:5173
- **Backend API** : http://localhost:3000
- **PostgreSQL** : localhost:5432
- **Redis** : localhost:6379

## 👤 Comptes de Test

### Compte Administrateur
- **Email** : admin@cuiz.com
- **Mot de passe** : admin123

### Créer un Compte Utilisateur
1. Allez sur http://localhost:5173
2. Cliquez sur "S'inscrire"
3. Remplissez le formulaire d'inscription

## 🗄️ Base de Données

### Structure
L'application utilise PostgreSQL avec Prisma comme ORM. Les modèles principaux incluent :

- **Users** : Utilisateurs de la plateforme
- **Transactions** : Dépôts, retraits, investissements
- **Investments** : Plans et investissements actifs
- **Tasks** : Micro-tâches rémunérées
- **Commissions** : Système de parrainage
- **Admins** : Gestionnaires de la plateforme

### Commandes Utiles

```bash
# Voir la base de données avec Prisma Studio
cd backend
npx prisma studio

# Réinitialiser la base de données
npx prisma migrate reset

# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration
```

## 🔧 Scripts Disponibles

### Backend

```bash
cd backend

# Développement
npm run dev          # Démarrer en mode développement
npm run build        # Compiler le projet
npm run start        # Démarrer en mode production

# Base de données
npm run migrate      # Exécuter les migrations
npm run db:seed      # Seeder la base de données
npm run db:studio    # Ouvrir Prisma Studio

# Tests
npm run test         # Exécuter les tests
npm run test:watch   # Tests en mode watch
```

### Frontend

```bash
cd frontend

# Développement
npm run dev          # Démarrer en mode développement
npm run build        # Compiler pour la production
npm run preview      # Prévisualiser la build

# Qualité du code
npm run lint         # Vérifier le code
npm run lint:fix     # Corriger automatiquement
npm run type-check   # Vérifier les types TypeScript
```

## 🐛 Débogage

### Logs Backend
Les logs sont disponibles dans `backend/logs/` :
- `combined.log` : Tous les logs
- `error.log` : Logs d'erreur uniquement

### Variables d'Environnement
Modifiez `backend/.env` pour ajuster la configuration :

```env
# Base de données
DATABASE_URL="postgresql://postgres:password@localhost:5432/cuiz_investment"

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 📁 Structure du Projet

```
cuiz-investment/
├── backend/                 # API Node.js/Express
│   ├── src/
│   │   ├── controllers/     # Contrôleurs API
│   │   ├── middleware/      # Middleware Express
│   │   ├── routes/          # Routes API
│   │   ├── utils/           # Utilitaires
│   │   └── database/        # Scripts de base de données
│   ├── prisma/              # Schéma et migrations
│   └── package.json
├── frontend/                # Application React
│   ├── src/
│   │   ├── components/      # Composants React
│   │   ├── pages/           # Pages de l'application
│   │   ├── contexts/        # Contextes React
│   │   ├── utils/           # Utilitaires
│   │   └── types/           # Types TypeScript
│   └── package.json
├── docker-compose.dev.yml   # Services de développement
└── start-dev.sh            # Script de démarrage
```

## 🚨 Problèmes Courants

### Port 3000 déjà utilisé
```bash
# Vérifier ce qui utilise le port
lsof -i :3000

# Tuer le processus
kill -9 <PID>
```

### Erreur de connexion à PostgreSQL
```bash
# Vérifier que PostgreSQL est démarré
docker-compose -f docker-compose.dev.yml ps

# Redémarrer PostgreSQL
docker-compose -f docker-compose.dev.yml restart postgres
```

### Erreurs de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

Pour toute question ou problème :
1. Vérifiez les logs dans `backend/logs/`
2. Consultez la documentation Prisma
3. Vérifiez que tous les services sont démarrés

---

**Bon développement ! 🎉**