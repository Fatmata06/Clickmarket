# Gestion des Pages Supprimées ou Non Trouvées

## Vue d'ensemble

L'application ClickMarket dispose d'un système complet de gestion des pages d'erreur pour les ressources supprimées ou non trouvées.

## Composants disponibles

### 1. ProductNotFound (pour les produits)

**Chemin**: `components/products/ProductNotFound.tsx`

Utilisé quand un produit n'existe pas ou a été supprimé.

**Propriétés**:

- `id` (string, optionnel): L'ID du produit recherché
- `reason` ("deleted" | "modified" | "not_found"): Type d'erreur
- `showBackButton` (boolean): Afficher le bouton retour

**Exemple d'utilisation**:

```tsx
<ProductNotFound id={productId} reason="not_found" />
```

**Pages utilisant ce composant**:

- `/produits/[id]` - Page de détail produit

### 2. NotFoundPage (générique)

**Chemin**: `components/common/NotFoundPage.tsx`

Page d'erreur générique réutilisable pour toutes les ressources.

**Propriétés**:

- `title` (string): Titre de la page
- `message` (string): Message d'erreur
- `icon` (string): Emoji pour illustrer l'erreur
- `showBackButton` (boolean): Afficher le bouton retour

**Exemple d'utilisation**:

```tsx
<NotFoundPage
  title="Catégorie non trouvée"
  message="Cette catégorie n'existe pas."
  icon="🏷️"
/>
```

**Pages utilisant ce composant**:

- `/categories/[slug]` - Page de catégorie

## Pages impactées

### Page de détail produit (`/produits/[id]`)

**Comportement**:

- Si le produit n'existe pas → Affiche le composant `ProductNotFound`
- Propose des liens vers:
  - Retour à la page précédente
  - Voir tous les produits
  - Retour à l'accueil
  - Formulaire de contact

**Code de gestion**:

```tsx
const { product, isLoading, error } = useProduct(resolvedParams.id);

if (error || !product) {
  return (
    <ProductNotFound
      id={resolvedParams.id}
      reason={error ? "not_found" : "not_found"}
    />
  );
}
```

### Page de catégorie (`/categories/[slug]`)

**Comportement**:

- Si la catégorie génère une erreur → Affiche le composant `NotFoundPage`
- Affiche un message adapté avec l'icône 🏷️

**Code de gestion**:

```tsx
const { products, isLoading, error } = useProducts({
  typeProduit: categoryType,
});

if (error) {
  return (
    <NotFoundPage
      title="Catégorie non trouvée"
      message={`La catégorie "${category.name}" n'existe pas...`}
      icon="🏷️"
    />
  );
}
```

## Fonctionnalités communes

Toutes les pages d'erreur proposent:

- ✅ Icône visuelle distinctive
- ✅ Titre clair et explicite
- ✅ Message détaillé
- ✅ Bouton "Retour à la page précédente"
- ✅ Lien vers le catalogue des produits
- ✅ Lien vers la page d'accueil
- ✅ Lien vers le formulaire de contact
- ✅ Design responsive et moderne
- ✅ Support du mode sombre

## Design et Style

### Couleurs utilisées:

**ProductNotFound (Produit supprimé)**:

- Couleur primaire: Rouge (`red-100`, `red-900`)
- Icône: 🗑️, 🔍, ✏️

**NotFoundPage (Générique)**:

- Couleur primaire: Jaune (`yellow-100`, `yellow-900`)
- Icône: Customisable par l'utilisateur

### Responsive:

- Mobile: Padding et layout ajustés
- Tablet: Affichage normal
- Desktop: Affichage normal avec meilleur espacement

## À ajouter (Futur)

- [ ] Page d'erreur pour les commandes supprimées
- [ ] Page d'erreur pour les favoris supprimés
- [ ] Animation des icônes
- [ ] Modal de contact directement depuis la page d'erreur
- [ ] Suggestions automatiques basées sur l'historique
- [ ] Sitemap et suggestions de produits similaires
