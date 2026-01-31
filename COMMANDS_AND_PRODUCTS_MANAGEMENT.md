# ClickMarket - Gestion Complète des Commandes et Produits

## 📋 Vue d'ensemble des changements

Ce document résume les modifications apportées au système de gestion des commandes et des produits pour implémenter les règles métier complètes.

---

## 🎯 Règles Métier Implémentées

### 1. **Gestion des Commandes**

#### **Client**

- ✅ Crée une commande depuis le panier
- ✅ Peut **annuler UNIQUEMENT si statut = `en_attente`**
- ✅ Peut modifier l'adresse de livraison UNIQUEMENT si statut = `en_attente`
- ❌ Une fois confirmée (statut = `confirmee`), la commande est en lecture seule

#### **Fournisseur**

- ✅ Peut confirmer une commande : `en_attente` → `confirmee`
- ✅ Peut mettre en préparation : `confirmee` → `en_preparation`
- ✅ Peut expédier : `en_preparation` → `expediee`
- ✅ Peut marquer comme livrée : `expediee` → `livree`
- ❌ **NE PEUT PAS** modifier les articles ou l'adresse de la commande
- ❌ **NE PEUT PAS** annuler une commande

#### **Admin**

- ✅ Peut changer le statut de la commande à tout moment (sauf si `livree`)
- ❌ **NE PEUT PAS** modifier les articles ou l'adresse de la commande
- ✅ Peut annuler une commande

#### **Historique des Statuts**

- ✅ Tous les changements de statut sont enregistrés dans `historiqueStatuts`
- ✅ Traçabilité complète : qui, quand, raison
- ✅ Visible par le client et l'admin via une timeline

### 2. **Gestion des Produits**

#### **Fournisseur**

- ✅ Crée un produit (statut = `en_attente` ou `accepte` si TRUSTED)
- ✅ Peut modifier son produit
- ✅ **Modifying un produit `accepte` → le remet automatiquement à `en_attente`**
- ✅ Voit uniquement ses propres produits

#### **Admin**

- ✅ Voit tous les produits en attente de validation (sauf TRUSTED_FOURNISSEUR)
- ✅ Peut **accepter** un produit (`en_attente` → `accepte`)
- ✅ Peut **refuser** un produit (`en_attente` → `refuse`) avec raison
- ✅ Peut modifier le statut de validation d'un produit directement
- ✅ Page dédiée `/admin/produits/validation` pour gérer les validations

#### **Produits Non Validés**

- ❌ Les produits `en_attente` ou `refuse` **NE SONT PAS VISIBLES** sur la plateforme
- ✅ Seuls les produits `accepte` sont affichés publiquement

---

## 🔧 Implémentation Technique

### **Backend - Files Modifiés**

#### 1. `Backend/src/models/Commande.js`

```javascript
// Nouveau schéma pour historique des statuts
historiqueStatuts: [
  {
    ancienStatut: String,
    nouveauStatut: String,
    modifiePar: Reference(User),
    dateModification: Date,
    raison: String,
  },
];

// Nouvelle méthode
commande.enregistrerChangementStatut(ancien, nouveau, userId, raison);
```

#### 2. `Backend/src/controllers/commandeController.js`

**annulerCommande()**

- Vérifie : Client UNIQUEMENT si `en_attente`
- Enregistre le changement de statut
- Raison par défaut : "Annulation par le client" ou "Annulation par admin"

**mettreAJourStatut()**

- Transitions validées pour fournisseur
- Enregistre tous les changements dans `historiqueStatuts`
- Gère les transitions : `en_attente` → `confirmee` → `en_preparation` → `expediee` → `livree`

**modifierAdresseLivraison()**

- UNIQUEMENT si statut = `en_attente`
- UNIQUEMENT pour le propriétaire (client)
- Enregistre dans l'historique des modifications

**getHistoriqueStatuts()** (NEW)

- Retourne la liste complète des changements de statut
- Peuplée avec les infos du modifieur (nom, email, rôle)

#### 3. `Backend/src/controllers/produitController.js`

**updateProduit()**

- Si fournisseur modifie un produit `accepte` → passe à `en_attente`
- Admin peut directement définir le statut de validation

**getProduitsEnAttente()** (NEW)

- Filtre : `statutValidation = 'en_attente'`
- Exclut les produits du TRUSTED_FOURNISSEUR
- Pagination et recherche

#### 4. Routes

- `PATCH /api/commandes/:id/statut` - Changer le statut (admin/fournisseur)
- `PATCH /api/commandes/:id/annuler` - Annuler (client/admin)
- `GET /api/commandes/:id/historique-statuts` - Récupérer l'historique
- `GET /api/produits/validation/en-attente` - Produits en attente (admin)
- `PATCH /api/produits/:id/accepter` - Accepter (admin)
- `PATCH /api/produits/:id/refuser` - Refuser (admin)

---

### **Frontend - Files Modifiés**

#### 1. `frontend/app/(protected)/commandes/[id]/page.tsx`

- Annulation restreinte à `en_attente` uniquement
- Affichage de l'historique des statuts avec timeline
- Récupération dynamique via `getHistoriqueStatuts()`
- Chaque entrée affiche :
  - Ancien → Nouveau statut (badges)
  - Qui a fait le changement (nom, rôle)
  - Quand (date/heure formatée)
  - Raison (si fournie)

#### 2. `frontend/app/(protected)/admin/produits/validation/page.tsx` (NEW)

- Page exclusive aux admins
- Affichage des produits en attente
- Bouttons : Accepter / Refuser
- Dialog pour raison de refus
- Recherche et pagination
- Affichage des détails : prix, stock, fournisseur

#### 3. `frontend/components/products/ProductFormShared.tsx`

- Détection du rôle utilisateur (localStorage)
- Section "Statut de validation" visible UNIQUEMENT pour admin en mode edit
- Select pour changer le statut : En attente / Accepté / Refusé
- Badge de statut pour visualisation rapide

#### 4. `frontend/lib/api/commandes.ts`

```typescript
// Nouvelle fonction
getHistoriqueStatuts(id: string): Promise<HistoriqueStatut[]>
```

#### 5. `frontend/lib/api/produits.ts`

```typescript
// Nouvelle fonction
getProduitsEnAttente(params?: GetProduitsParams): Promise<ProduitsResponse>
```

---

## 📊 Flux de Travail Complet

### **Flux Client - Commande**

```
1. Client crée une commande (panier → commande)
   ↓
2. Statut initial : en_attente
   ↓
3. Options :
   A) Modifier adresse ✅ (tant que en_attente)
   B) Annuler la commande ✅ (tant que en_attente)
   C) Attendre que fournisseur confirme
   ↓
4. Fournisseur confirme → en_attente → confirmee
   ↓
5. Maintenant commande = LECTURE SEULE pour client
   ↓
6. Fournisseur prépare & expédie
   ↓
7. Statut : livree → Fin du cycle
```

### **Flux Fournisseur - Commande**

```
1. Voit commande en en_attente
   ↓
2. Confirme → confirmee
   ↓
3. Prépare → en_preparation
   ↓
4. Expédie → expediee
   ↓
5. Marque livrée → livree

⚠️ NE PEUT JAMAIS :
- Modifier articles/adresse
- Annuler la commande
```

### **Flux Admin - Produit**

```
1. Admin visite /admin/produits/validation
   ↓
2. Voit produits en_attente (filtrés)
   ↓
3. Options :
   A) Accepter → accepte (visible en plateforme)
   B) Refuser → refuse (caché, raison au fournisseur)
   ↓
4. Fournisseur peut refonder le produit
   ↓
5. Si modifie un produit accepte → en_attente (revalidation)
```

---

## 🔐 Sécurité & Validations

### **Contrôles d'Accès**

- Client : Peut UNIQUEMENT annuler/modifier sa propre commande en `en_attente`
- Fournisseur : Transitions de statut limitées, pas de modification
- Admin : Accès complet mais PAS de modification des articles/adresse

### **Transitions de Statut Validées**

```javascript
FOURNISSEUR transitions:
- en_attente → confirmee ✅
- confirmee → en_preparation ✅
- en_preparation → expediee ✅
- expediee → livree ✅
- (Autres transitions = rejetées)

ADMIN transitions:
- N'importe quel statut → N'importe quel autre (sauf livree→retour)
```

### **Historique Immuable**

- Tous les changements enregistrés automatiquement
- Impossible de modifier l'historique
- Traçabilité 100% complète

---

## 📱 Endpoints API

### **Commandes**

| Endpoint                                | Méthode | Rôle              | Description                   |
| --------------------------------------- | ------- | ----------------- | ----------------------------- |
| `/api/commandes`                        | POST    | Client            | Créer commande                |
| `/api/commandes/:id`                    | GET     | Client/Admin      | Récupérer détails             |
| `/api/commandes/:id/annuler`            | PATCH   | Client/Admin      | Annuler (restrictions)        |
| `/api/commandes/:id/statut`             | PATCH   | Admin/Fournisseur | Changer statut                |
| `/api/commandes/:id/adresse`            | PATCH   | Client            | Modifier adresse (en_attente) |
| `/api/commandes/:id/historique-statuts` | GET     | Client/Admin      | Historique                    |

### **Produits**

| Endpoint                              | Méthode | Rôle              | Description                 |
| ------------------------------------- | ------- | ----------------- | --------------------------- |
| `/api/produits`                       | POST    | Fournisseur       | Créer produit               |
| `/api/produits`                       | PATCH   | Fournisseur/Admin | Modifier (remet en_attente) |
| `/api/produits/validation/en-attente` | GET     | Admin             | Voir en attente             |
| `/api/produits/:id/accepter`          | PATCH   | Admin             | Accepter                    |
| `/api/produits/:id/refuser`           | PATCH   | Admin             | Refuser + raison            |

---

## ✅ Tests Recommandés

### **Client**

- [ ] Créer commande
- [ ] Modifier adresse (en_attente) ✅
- [ ] Modifier adresse (confirmee) - doit échouer
- [ ] Annuler (en_attente) ✅
- [ ] Annuler (confirmee) - doit échouer
- [ ] Voir historique des statuts

### **Fournisseur**

- [ ] Confirmer commande (en_attente → confirmee)
- [ ] Mettre en_preparation (confirmee → en_preparation)
- [ ] Expédier (en_preparation → expediee)
- [ ] Marquer livrée (expediee → livree)
- [ ] Transition invalide - doit échouer
- [ ] Modifier produit accepte → en_attente

### **Admin**

- [ ] Voir produits en_attente
- [ ] Accepter produit
- [ ] Refuser produit avec raison
- [ ] Changer statut commande
- [ ] Annuler commande
- [ ] Voir historique

---

## 📝 Notes d'Implémentation

1. **Variables d'Environnement**
   - `TRUSTED_FOURNISSEUR_IDS` : Fournisseurs dont les produits ignorent la validation

2. **Bases de Données**
   - Schéma `historiqueStatuts` ajouté à Commande
   - `statutValidation` utilisé pour Produit

3. **États de Produit**
   - `en_attente` : Non visible (en validation)
   - `accepte` : Visible publiquement
   - `refuse` : Non visible

4. **États de Commande**
   - `en_attente` : Modifiable par client
   - `confirmee` : Lecture seule pour client
   - `en_preparation` → `expediee` → `livree` : Suivi fournisseur

---

## 🚀 Déploiement

1. Mettre à jour le Backend
2. Mettre à jour le Frontend
3. Tester les flux critiques
4. Documenter pour les utilisateurs
5. Formation des admins/fournisseurs

---

**Version** : 1.0  
**Date** : 31 Janvier 2026  
**Statut** : ✅ Implémenté
