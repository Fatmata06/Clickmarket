# ClickMarket — Backend

API REST pour ClickMarket (Node.js + Express + MongoDB).

## Stack

- Express
- MongoDB + Mongoose
- Auth JWT
- Cloudinary (upload images)
- Swagger (doc API)

## Scripts

```bash
npm run dev   # nodemon server.js
npm start     # node server.js
```

## Configuration

Créer un fichier `Backend/.env` :

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/clickmarket
JWT_SECRET=change_me
CLOUDINARY_CLOUD_NAME=change_me
CLOUDINARY_API_KEY=change_me
CLOUDINARY_API_SECRET=change_me
CLIENT_URL=http://localhost:3000
```

## Démarrage

```bash
npm install
npm run dev
```

## Modules principaux

- Authentification
- Produits
- Panier
- Commandes
- Fournisseurs
- Zones de livraison

## Notes

- La base MongoDB doit être accessible via `MONGODB_URI`.
- Le CORS est configuré pour `CLIENT_URL`.

## Déploiement sur Render

1. Pousser le code vers GitHub
2. Connecter le repo à Render.com
3. Créer un service Web
4. Définir les variables d'environnement dans Render
5. La production est accessible à `https://clickmarche.onrender.com`
