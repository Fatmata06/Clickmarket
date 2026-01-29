# ClickMarket - Plateforme de Commerce Agricole

Plateforme web complète pour la vente de produits agricoles en ligne. Connecte producteurs et acheteurs avec une interface intuitive et sécurisée.

## 📋 Vue d'ensemble

ClickMarket est une application full-stack permettant aux agriculteurs de vendre directement leurs produits aux consommateurs et professionnels. La plateforme inclut :

- **Catalogue produits** avec images, descriptions et gestion d'inventaire
- **Système de commandes** avec confirmation et suivi
- **Panier dynamique** avec validation
- **Gestion des utilisateurs** (admin, fournisseurs, clients)
- **Dashboard multi-rôles** pour chaque type d'utilisateur
- **Zones de livraison** configurables

## 🏗️ Architecture

```
ClickMarket/
├── Backend/               # API Node.js/Express
│   ├── src/
│   │   ├── config/       # Configuration DB, Cloudinary, Multer
│   │   ├── controllers/  # Logique métier
│   │   ├── models/       # Modèles Mongoose
│   │   ├── routes/       # Endpoints API
│   │   ├── middleware/   # Auth, validation
│   │   └── docs/         # Documentation Swagger
│   ├── package.json
│   └── server.js
│
└── frontend/              # Application Next.js
    ├── app/              # Pages (App Router)
    ├── components/       # Composants React
    ├── lib/              # Hooks et utilitaires
    ├── public/           # Assets statiques
    └── package.json
```

## 🚀 Démarrage rapide

### Backend

```bash
cd Backend
npm install

# Variables d'environnement (.env)
MONGODB_URI=mongodb+srv://...
JWT_SECRET=votre_secret
CLOUDINARY_NAME=...
CLOUDINARY_KEY=...
CLOUDINARY_SECRET=...
PORT=5000

npm run dev
# API disponible sur http://localhost:5000/api
```

### Frontend

```bash
cd frontend
npm install

# Variables d'environnement (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:5000/api

npm run dev
# Application disponible sur http://localhost:3000
```

## 🔐 Authentification

### Rôles utilisateur

1. **Client** - Achète les produits
   - Parcourir le catalogue
   - Gérer son panier
   - Créer des commandes
   - Voir ses commandes et favoris

2. **Fournisseur** - Vend les produits
   - Gérer ses produits
   - Voir ses commandes
   - Gérer ses zones de livraison

3. **Admin** - Administre la plateforme
   - Gestion complète des utilisateurs
   - Gestion des produits (tous les fournisseurs)
   - Gestion des commandes
   - Configuration des zones

### Flux d'authentification

```
1. Inscription/Connexion
2. JWT token généré et stocké en localStorage
3. Token inclus dans tous les appels API (header Authorization)
4. Redirection automatique si token expiré/invalide
5. Logout → suppression du token
```

## 📱 Pages principales

### Publiques

- `/` - Accueil
- `/produits` - Catalogue produits
- `/produits/[id]` - Détails produit
- `/categories/[slug]` - Produits par catégorie
- `/about` - À propos
- `/contact` - Contact

### Authentification

- `/login` - Connexion
- `/register` - Inscription
- `/reset-password` - Réinitialisation mot de passe

### Protégées (Authentification requise)

- `/dashboard` - Dashboard unifié par rôle
- `/profil` - Profil utilisateur
- `/parametres` - Paramètres compte
- `/commandes` - Mes commandes
- `/panier` - Mon panier
- `/favoris` - Mes favoris

### Admin

- `/admin/users` - Gestion utilisateurs
- `/produits/gestion` - Gestion tous les produits
- `/produits/modifier/[id]` - Modifier un produit

### Fournisseur

- `/fournisseur/produits` - Mes produits
- `/fournisseur/produits/nouveau` - Nouveau produit
- `/fournisseur/produits/modifier/[id]` - Modifier produit

## 🔌 API Endpoints

### Authentification

- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/logout` - Déconnexion
- `POST /auth/refresh-token` - Rafraîchir token

### Produits

- `GET /produits` - Lister produits
- `GET /produits?category=X&search=Y` - Filtrer/chercher
- `GET /produits/:id` - Détails produit
- `POST /produits` - Créer produit (fournisseur/admin)
- `PUT /produits/:id` - Modifier produit
- `DELETE /produits/:id` - Supprimer produit

### Commandes

- `GET /commandes` - Mes commandes
- `POST /commandes` - Créer commande
- `GET /commandes/:id` - Détails commande
- `PATCH /commandes/:id/status` - Changer statut (admin)

### Utilisateurs (Admin)

- `GET /admin/users` - Lister utilisateurs
- `GET /admin/users/:id` - Détails utilisateur
- `DELETE /admin/users/:id` - Supprimer utilisateur
- `PATCH /admin/users/:id/role` - Changer rôle

### Panier

- `GET /panier` - Mon panier
- `POST /panier` - Ajouter au panier
- `PUT /panier/:id` - Modifier quantité
- `DELETE /panier/:id` - Supprimer du panier

### Zones de livraison

- `GET /zones-livraison` - Lister zones
- `POST /zones-livraison` - Créer zone (admin)
- `DELETE /zones-livraison/:id` - Supprimer zone (admin)

## 🗄️ Modèles de données

### User

```javascript
{
  nom: string,
  prenom: string,
  email: string (unique),
  password: string (hashed),
  role: "admin" | "fournisseur" | "client",
  entreprise: string (pour fournisseurs),
  adresse: string,
  telephone: string,
  dateInscription: date,
  actif: boolean
}
```

### Produit

```javascript
{
  nom: string,
  description: string,
  prix: number,
  categorie: string,
  fournisseur: ObjectId (ref User),
  images: string[],
  quantiteDisponible: number,
  createdAt: date,
  updatedAt: date
}
```

### Commande

```javascript
{
  numero: string (unique),
  client: ObjectId (ref User),
  articles: [{
    produit: ObjectId,
    quantite: number,
    prixUnitaire: number
  }],
  montantTotal: number,
  statut: "en_attente" | "confirmée" | "en_cours" | "livrée" | "annulée",
  adresseLivraison: string,
  zoneLivraison: ObjectId,
  dateCommande: date,
  dateLivraison: date
}
```

## 🛠️ Développement

### Stack Backend

- Node.js + Express.js
- MongoDB + Mongoose
- Multer (upload images)
- Cloudinary (stockage images)
- JWT (authentification)
- Swagger (documentation API)

### Stack Frontend

- Next.js 16+ (App Router)
- TypeScript
- React Hooks + Context API
- TailwindCSS + Shadcn/UI
- Sonner (notifications)

### Commandes utiles

```bash
# Backend
cd Backend
npm run dev          # Démarrage dev
npm run build        # Build production
npm test             # Tests

# Frontend
cd frontend
npm run dev          # Démarrage dev
npm run build        # Build production
npm run lint         # Linting
```

## 📊 Fonctionnalités principales

- ✅ Authentification sécurisée (JWT)
- ✅ Multi-rôles (admin, fournisseur, client)
- ✅ Catalogue produits avec filtres
- ✅ Panier dynamique
- ✅ Système de commandes
- ✅ Upload d'images (Cloudinary)
- ✅ Gestion des zones de livraison
- ✅ Dashboard par rôle
- ✅ Favoris produits
- ✅ Notifications en temps réel (Sonner)

## 🔐 Sécurité

- Mots de passe hashés (bcrypt)
- JWT tokens avec expiration
- Validation côté serveur
- Protection des routes
- CORS configuré
- Validation des images

## 📦 Déploiement

### Backend (Render.com / Heroku)

```bash
# Définir les variables d'environnement
# Connecter le repo GitHub
# Deploy automatique à chaque push
```

### Frontend (Vercel)

```bash
# Connecter le repo Next.js à Vercel
# Définir NEXT_PUBLIC_API_URL
# Deploy automatique
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Documentation

- [Frontend README](./frontend/README.md) - Documentation frontend détaillée
- [Backend API Docs](./Backend/docs/swagger.js) - Swagger documentation
- [Refactoring Guide](./frontend/REFACTORING.md) - Guide de refactorisation

## 📞 Support et Contact

Pour toute question ou issue :

- Ouvrir une GitHub issue
- Contacter l'équipe via `/contact`

## 📄 Licence

Ce projet est sous licence [MIT](LICENSE)

## 👥 Équipe

Développement en cours par l'équipe ClickMarket.

---

**Dernière mise à jour**: 2024
