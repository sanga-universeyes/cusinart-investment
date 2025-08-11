#!/bin/bash

echo "🚀 Démarrage de CUIZ Investment en mode développement..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Créer les dossiers nécessaires
echo "📁 Création des dossiers nécessaires..."
mkdir -p backend/logs
mkdir -p backend/uploads
mkdir -p frontend/dist

# Démarrer les services de base (PostgreSQL et Redis)
echo "🐘 Démarrage de PostgreSQL..."
echo "🔴 Démarrage de Redis..."
docker-compose -f docker-compose.dev.yml up -d postgres redis

# Attendre que PostgreSQL soit prêt
echo "⏳ Attente que PostgreSQL soit prêt..."
sleep 10

# Installer les dépendances du backend
echo "📦 Installation des dépendances backend..."
cd backend
npm install

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npx prisma generate

# Exécuter les migrations
echo "🗄️ Exécution des migrations de base de données..."
npx prisma migrate dev --name init

# Seeder la base de données
echo "🌱 Seeding de la base de données..."
npm run db:seed

cd ..

# Installer les dépendances du frontend
echo "📦 Installation des dépendances frontend..."
cd frontend
npm install
cd ..

# Démarrer le backend
echo "🔧 Démarrage du backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Attendre que le backend soit prêt
echo "⏳ Attente que le backend soit prêt..."
sleep 5

# Démarrer le frontend
echo "🎨 Démarrage du frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ CUIZ Investment est maintenant en cours d'exécution !"
echo ""
echo "📱 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3000"
echo "🗄️ PostgreSQL: localhost:5432"
echo "🔴 Redis: localhost:6379"
echo ""
echo "👤 Compte admin par défaut:"
echo "   Email: admin@cuiz.com"
echo "   Mot de passe: admin123"
echo ""
echo "🛑 Pour arrêter les services, appuyez sur Ctrl+C"

# Fonction de nettoyage
cleanup() {
    echo ""
    echo "🛑 Arrêt des services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    docker-compose -f docker-compose.dev.yml down
    echo "✅ Services arrêtés."
    exit 0
}

# Capturer Ctrl+C
trap cleanup SIGINT

# Attendre indéfiniment
wait