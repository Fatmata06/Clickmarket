# Configuration de Production - ClickMarket

## URLs de Production

| Service      | URL                                       |
| ------------ | ----------------------------------------- |
| Frontend     | https://clickmarche.vercel.app            |
| Backend API  | https://clickmarche.onrender.com/api      |
| Swagger Docs | https://clickmarche.onrender.com/api-docs |

## Backend (Render)

### Variables d'environnement (à configurer dans Render Dashboard)

```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://[username]:[password]@cluster0.xxxxx.mongodb.net/clickmarketbd?retryWrites=true&w=majority
JWT_SECRET=[votre_jwt_secret_sécurisé]
CLOUDINARY_CLOUD_NAME=[votre_cloud_name]
CLOUDINARY_API_KEY=[votre_api_key]
CLOUDINARY_API_SECRET=[votre_api_secret]
FRONTEND_URL=https://clickmarche.vercel.app
```

### Configuration CORS

Le backend accepte les requêtes CORS uniquement de :

- `https://clickmarche.vercel.app` (production)
- `http://localhost:3000` (développement local)

## Frontend (Vercel)

### Variables d'environnement (à configurer dans Vercel Settings)

```
NEXT_PUBLIC_API_URL=https://clickmarche.onrender.com/api
```

### Build Settings

- **Build Command** : `npm run build`
- **Output Directory** : `.next`
- **Node Version** : 18.x ou supérieur

## Checklist de Déploiement

- ✅ Frontend déployé sur Vercel (https://clickmarche.vercel.app)
- ✅ Backend déployé sur Render (https://clickmarche.onrender.com)
- ✅ MongoDB Atlas configuré et accessible
- ✅ Cloudinary configuré pour les uploads d'images
- ✅ CORS configuré pour accepter les requêtes du frontend
- ✅ Variables d'environnement définies dans chaque plateforme
- ✅ JWT_SECRET configuré et sécurisé
- ✅ FRONTEND_URL mis à jour dans le backend

## Monitoring

### Logs Render

Accessible dans le dashboard Render pour surveiller les erreurs du backend.

### Logs Vercel

Accessible dans le dashboard Vercel pour surveiller les erreurs du frontend.

## Troubleshooting

### Erreur "CORS policy"

→ Vérifier que `FRONTEND_URL` est correct dans le .env du backend

### API inaccessible

→ Vérifier que le backend Render est actif et accessible

### Images Cloudinary ne s'affichent pas

→ Vérifier les credentials Cloudinary et les permissions d'accès

### Session panier perdue

→ Vérifier que les cookies sont bien configurés (httpOnly, secure en production)
