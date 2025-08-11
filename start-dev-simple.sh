#!/bin/bash

echo "🚀 Démarrage de CUIZ Investment en mode développement (sans Docker)..."

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Veuillez installer Node.js d'abord."
    exit 1
fi

# Vérifier si npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé. Veuillez installer npm d'abord."
    exit 1
fi

# Créer les dossiers nécessaires
echo "📁 Création des dossiers nécessaires..."
mkdir -p backend/logs
mkdir -p backend/uploads
mkdir -p frontend/dist

# Installer les dépendances du backend
echo "📦 Installation des dépendances backend..."
cd backend
npm install

# Vérifier si le fichier .env existe
if [ ! -f .env ]; then
    echo "📝 Création du fichier .env..."
    cp .env.example .env
fi

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Note: Les migrations nécessitent une base de données PostgreSQL
echo "⚠️  Note: Les migrations nécessitent une base de données PostgreSQL"
echo "   Vous pouvez utiliser une base de données locale ou cloud"
echo "   Modifiez DATABASE_URL dans backend/.env si nécessaire"

cd ..

# Installer les dépendances du frontend
echo "📦 Installation des dépendances frontend..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Installation terminée !"
echo ""
echo "📋 Prochaines étapes :"
echo ""
echo "1. Configurez votre base de données PostgreSQL :"
echo "   - Modifiez DATABASE_URL dans backend/.env"
echo "   - Ou utilisez une base de données cloud (Supabase, Railway, etc.)"
echo ""
echo "2. Démarrer le backend :"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Démarrer le frontend :"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "4. Exécuter les migrations (après avoir configuré la base de données) :"
echo "   cd backend"
echo "   npx prisma migrate dev --name init"
echo "   npm run db:seed"
echo ""
echo "🌐 URLs :"
echo "   Frontend: http://localhost:5173"
echo "   Backend: http://localhost:3000"
echo ""
echo "👤 Compte admin par défaut :"
echo "   Email: admin@cuiz.com"
echo "   Mot de passe: admin123"