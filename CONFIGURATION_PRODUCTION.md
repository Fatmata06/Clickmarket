# Résumé des URLs et Configuration - Production

## 🌐 URLs Publiques

| Service            | URL                                       | Statut   |
| ------------------ | ----------------------------------------- | -------- |
| Frontend           | https://clickmarche.vercel.app            | ✅ Actif |
| Backend API        | https://clickmarche.onrender.com/api      | ✅ Actif |
| API Docs (Swagger) | https://clickmarche.onrender.com/api-docs | ✅ Actif |

## 🔐 Configuration Sécurité

### CORS (Backend)

Le backend accepte les requêtes CORS uniquement de :

- `https://clickmarche.vercel.app` (production)
- `http://localhost:3000` (développement local)

### JWT Authentication

- Algorithme : HS256
- Secret stocké dans les variables d'environnement Render
- Tokens envoyés via Authorization header

### HTTPS/Cookies

- Les cookies `cartSessionId` sont `httpOnly` et `secure`
- Tous les requêtes en production utilisent HTTPS

## 📊 Architecture de Communication

```
┌─────────────────────────────────────────┐
│  Frontend (Vercel)                      │
│  https://clickmarche.vercel.app         │
└──────────────┬──────────────────────────┘
               │
               │ HTTPS Requests
               │ API_URL = https://clickmarche.onrender.com/api
               │
┌──────────────▼──────────────────────────┐
│  Backend (Render)                       │
│  https://clickmarche.onrender.com       │
└──────────────┬──────────────────────────┘
               │
               │ MongoDB Driver
               │
┌──────────────▼──────────────────────────┐
│  MongoDB Atlas                          │
│  mongodb+srv://[credentials]@cluster... │
└─────────────────────────────────────────┘
```

## 🔄 Variables d'Environnement

### Backend (Render Dashboard Settings)

```
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://[username]:[password]@cluster0.xxxxx.mongodb.net/clickmarketbd
JWT_SECRET=[string_long_et_complexe]
CLOUDINARY_CLOUD_NAME=[value]
CLOUDINARY_API_KEY=[value]
CLOUDINARY_API_SECRET=[value]
FRONTEND_URL=https://clickmarche.vercel.app
```

### Frontend (Vercel Dashboard Settings)

```
NEXT_PUBLIC_API_URL=https://clickmarche.onrender.com/api
```

## 📈 Performance & Monitoring

### Vercel Analytics

- Accessible dans le dashboard Vercel
- Performance monitoring automatique

### Render Logs

- Accessible dans le dashboard Render
- Logs de toutes les requêtes et erreurs

## ✅ Checklist de Santé

- [ ] Frontend accessible sur https://clickmarche.vercel.app
- [ ] Backend accessible sur https://clickmarche.onrender.com
- [ ] Swagger docs accessibles sur https://clickmarche.onrender.com/api-docs
- [ ] Authentification fonctionne
- [ ] Panier fonctionne
- [ ] Uploads Cloudinary fonctionnent
- [ ] MongoDB accessible sans erreurs
- [ ] Pas d'erreurs CORS

## 📞 Troubleshooting Rapide

| Problème                   | Solution                                   |
| -------------------------- | ------------------------------------------ |
| "Cannot reach API"         | Vérifier que le service Render est actif   |
| "CORS error"               | Vérifier FRONTEND_URL dans Render env vars |
| "401 Unauthorized"         | Vérifier le JWT_SECRET et les tokens       |
| "Images don't load"        | Vérifier credentials Cloudinary            |
| "MongoDB connection fails" | Vérifier MONGO_URI et les IP whitelist     |

## 📝 Notes Importantes

- Ne jamais commiter les fichiers `.env` (vérifier `.gitignore`)
- Les secrets (JWT_SECRET, API keys) doivent rester en variables d'environnement
- Utiliser `.env.example` pour montrer la structure sans révéler les secrets
- Logs sensibles doivent être commentés ou conditioned sur NODE_ENV
