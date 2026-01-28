# ClickMarket

Plateforme e-commerce avec un backend Node/Express et un frontend Next.js.

## Aperçu

- **Backend** : API REST (auth, produits, panier, commandes, fournisseurs, zones de livraison)
- **Frontend** : application web (Next.js + TypeScript + Tailwind)

## Structure

- `Backend/` — API Express + MongoDB
- `frontend/` — application Next.js

## Prérequis

- Node.js 18+ (recommandé)
- MongoDB (local ou distant)

## Démarrage rapide

### Backend

```bash
cd Backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend par défaut sur http://localhost:3000. Le backend utilise le port défini par `PORT` (voir la configuration serveur).

## Variables d’environnement (exemples)

### Backend (`Backend/.env`)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clickmarket
JWT_SECRET=change_me
CLOUDINARY_CLOUD_NAME=change_me
CLOUDINARY_API_KEY=change_me
CLOUDINARY_API_SECRET=change_me
CLIENT_URL=http://localhost:3000
```

### Frontend (`frontend/.env.local`)

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Documentation

- Backend : voir [Backend/README.md](Backend/README.md)
- Frontend : voir [frontend/README.md](frontend/README.md)
