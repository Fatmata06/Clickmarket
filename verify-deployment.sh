#!/bin/bash

# Script de vérification pour le déploiement de ClickMarket

echo "🔍 Vérification du déploiement ClickMarket..."
echo ""

# Vérifier les fichiers de configuration
echo "📝 Fichiers de configuration :"
echo "✓ Backend/.env configuré" $(test -f Backend/.env && echo "✓" || echo "✗")
echo "✓ frontend/.env.local configuré" $(test -f frontend/.env.local && echo "✓" || echo "✗")
echo ""

# Vérifier les fichiers d'exemple
echo "📚 Fichiers d'exemple :"
echo "✓ Backend/.env.example" $(test -f Backend/.env.example && echo "✓" || echo "✗")
echo "✓ frontend/.env.example" $(test -f frontend/.env.example && echo "✓" || echo "✗")
echo ""

# Vérifier les packages
echo "📦 Package.json :"
echo "✓ Backend/package.json" $(test -f Backend/package.json && echo "✓" || echo "✗")
echo "✓ frontend/package.json" $(test -f frontend/package.json && echo "✓" || echo "✗")
echo ""

# Vérifier les configs de déploiement
echo "🚀 Configurations de déploiement :"
echo "✓ Backend/render.yaml" $(test -f Backend/render.yaml && echo "✓" || echo "✗")
echo "✓ frontend/vercel.json" $(test -f frontend/vercel.json && echo "✓" || echo "✗")
echo ""

# Vérifier les documentation
echo "📖 Documentation :"
echo "✓ README.md" $(test -f README.md && echo "✓" || echo "✗")
echo "✓ Backend/README.md" $(test -f Backend/README.md && echo "✓" || echo "✗")
echo "✓ frontend/README.md" $(test -f frontend/README.md && echo "✓" || echo "✗")
echo "✓ DEPLOYMENT.md" $(test -f DEPLOYMENT.md && echo "✓" || echo "✗")
echo ""

echo "✅ Vérification terminée !"
echo ""
echo "URLs de production :"
echo "  Frontend : https://clickmarche.vercel.app"
echo "  Backend  : https://clickmarche.onrender.com"
echo "  API      : https://clickmarche.onrender.com/api"
