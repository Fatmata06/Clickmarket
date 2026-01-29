# Frontend - ClickMarket

Application frontend Next.js pour la plateforme de commerce agricole ClickMarket.

## 🚀 Technologies

- **Framework**: Next.js 16+ (App Router)
- **Langage**: TypeScript
- **Styling**: TailwindCSS v4
- **Composants**: Shadcn/UI (Radix UI)
- **État**: React Hooks + Context API
- **Notifications**: Sonner
- **Authentification**: JWT

## 📋 Prérequis

- Node.js 18+
- npm ou yarn

## 🔧 Installation

```bash
# Cloner le projet
git clone <repository>
cd frontend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env.local
```

## ⚙️ Variables d'environnement

Créer un fichier `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🏃 Démarrage

```bash
# Mode développement
npm run dev

# Mode production
npm run build
npm run start

# Lint
npm run lint
```

L'application sera accessible sur http://localhost:3000

## 📁 Structure du projet

```
app/
├── (auth)/              # Pages d'authentification
├── (protected)/         # Pages protégées (authentification requise)
├── admin/               # Pages administrateur
├── about/               # Pages publiques
└── page.tsx             # Page d'accueil

components/
├── ui/                  # Composants Shadcn/UI
├── products/            # Composants produits
├── commandes/           # Composants commandes
└── layout/              # Composants layout

lib/
├── api/                 # Fonctions API
├── hooks/               # Custom hooks
└── utils.ts             # Utilitaires

public/                  # Assets statiques
```

## 🔐 Authentification

L'authentification utilise JWT tokens stockés dans `localStorage`:

```typescript
// Données stockées
{
  user: {
    _id: string;
    nom: string;
    prenom: string;
    email: string;
    role: "admin" | "fournisseur" | "client";
  },
  token: string;
}
```

### Hooks d'authentification

- `useAuth()` - Contexte d'authentification principal
- `useRoleAccess()` - Vérifier l'accès basé sur le rôle
- `useUserRole()` - Récupérer les informations utilisateur
- `useAuthValidation()` - Validation et gestion d'expiration du token

## 🎨 Composants principaux

### ProductFormShared

Formulaire universel pour création/modification de produits.

```tsx
<ProductFormShared
  mode="create" | "edit"
  initialData={produit}
  existingImages={images}
  backPath="/produits"
  onSubmitSuccess={() => router.push(...)}
/>
```

### UnifiedDashboard

Dashboard unique avec configuration par rôle (admin, fournisseur, client).

### ConfirmCommandeDialog

Dialog de confirmation de commande avec affichage du panier.

```tsx
<ConfirmCommandeDialog
  open={open}
  onOpenChange={setOpen}
  cartItems={items}
  onConfirm={handleConfirm}
/>
```

## 📚 Gestion de l'état

### Contexte d'authentification

- `AuthContext` - Gestion du user, token et authentification globale
- Utilisation: `const { user, isAuthenticated, logout } = useAuth()`

### Erreurs d'authentification

Gestion centralisée avec `EventTarget`:

- 401 → Déconnexion automatique
- Redirection vers `/login`

## 🔄 Flux d'une requête API

1. Composant appelle la fonction API
2. Récupération du token depuis `localStorage`
3. Envoi avec header `Authorization: Bearer ${token}`
4. Si 401 → `handleAuthError()` → Déconnexion + Redirection
5. Affichage du toast de notification

## 📱 Rôles et permissions

### Admin

- Accès complet
- Gestion utilisateurs (`/admin/users`)
- Gestion produits (`/produits/gestion`, `/produits/modifier/[id]`)
- Voir toutes les commandes

### Fournisseur

- Gérer ses propres produits (`/fournisseur/produits`)
- Créer/modifier produits (`/fournisseur/produits/nouveau`, `/fournisseur/produits/modifier/[id]`)
- Voir ses commandes

### Client

- Parcourir produits (`/produits`)
- Panier et commandes
- Favoris et profil

## 🧪 Hooks personnalisés

### useRoleAccess

Vérifie l'accès basé sur le rôle avec redirection automatique.

```tsx
useRoleAccess(["admin"], "/dashboard");
```

### useImageUpload

Gère l'upload et la prévisualisation d'images (max 5).

```tsx
const {
  imageFiles,
  previewImages,
  handleImageChange,
  removeImage,
  clearImages,
} = useImageUpload(5);
```

### useUserRole

Récupère les informations utilisateur connecté.

```tsx
const { user, role, isAdmin, isFournisseur, isClient, hasRole } = useUserRole();
```

## 🚨 Gestion des erreurs

### Erreurs d'authentification

- Centralisées via `auth-error-handler.ts`
- EventTarget global pour broadcast
- Affichage toast + redirection

### Erreurs API

- Try/catch dans chaque fonction API
- Toast d'erreur pour l'utilisateur
- Logs en console

## 🔄 Refactorisation

Voir [REFACTORING.md](./REFACTORING.md) pour :

- Réduction de 73% du code dupliqué
- Composants et hooks créés
- Migration guide

## 🛠️ Commandes de développement

```bash
# Format code
npm run lint -- --fix

# Build production
npm run build

# Vérifier tailles de bundle
npm run build -- --debug
```

## 📦 Dépendances principales

- `next`: Framework React
- `react-dom`: DOM React
- `lucide-react`: Icônes
- `tailwindcss`: Styling
- `@radix-ui/*`: Composants primitifs
- `sonner`: Toasts notifications
- `framer-motion`: Animations

## 🔗 Connexion au backend

L'API est configurée via `NEXT_PUBLIC_API_URL`:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
```

Endpoints principaux:

- `GET /produits` - Lister produits
- `POST /produits` - Créer produit
- `PUT /produits/:id` - Modifier produit
- `DELETE /produits/:id` - Supprimer produit
- `GET /commandes` - Lister commandes
- `POST /commandes` - Créer commande
- `GET /admin/users` - Lister utilisateurs (admin)

## 🤝 Contribution

1. Créer une branche feature
2. Faire les modifications
3. Tester localement
4. Créer une PR

## 📝 Notes importantes

- Toujours utiliser les hooks personnalisés pour la logique réutilisable
- Centraliser les appels API dans `lib/api/`
- Utiliser Shadcn/UI pour les composants
- Ajouter des tests pour les nouveaux hooks/fonctions
- Documenter les changements majeurs

## 📞 Support

Pour toute question sur la refactorisation ou l'architecture, voir [REFACTORING.md](./REFACTORING.md)
