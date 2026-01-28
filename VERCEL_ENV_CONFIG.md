# Configuration Vercel - Variables d'Environnement

## ⚠️ Important

Le fichier `.env.local` est utilisé **localement uniquement**. Vercel ne le lit pas automatiquement.

Pour que Vercel utilise les bonnes variables d'environnement en production, vous devez les configurer dans le **Vercel Dashboard**.

## 🔧 Étapes à Suivre

### 1. Aller dans le Vercel Dashboard

- Accédez à https://vercel.com/dashboard
- Sélectionnez le projet "ClickMarket" (ou le nom de votre projet frontend)

### 2. Aller dans les Settings

- Cliquez sur **Settings** en haut de la page du projet
- Sélectionnez **Environment Variables** dans le menu de gauche

### 3. Ajouter la variable

Cliquez sur **Add New** et remplissez :

```
Name: NEXT_PUBLIC_API_URL
Value: https://clickmarche.onrender.com/api
```

### 4. Sélectionner les environnements

Cochez les cases :

- ☑️ Production
- ☑️ Preview
- ☑️ Development

### 5. Sauvegarder

Cliquez sur **Save**

### 6. Redéployer

Allez dans **Deployments** et cliquez sur le menu à trois points de la dernière production, puis **Redeploy**.

Ou utilisez la ligne de commande :

```bash
vercel --prod --force
```

## ✅ Vérification

Après le redéploiement, vérifiez que :

1. Le frontend charge sans erreur 404
2. Les appels API à `https://clickmarche.onrender.com/api` réussissent
3. Les produits et le panier s'affichent correctement

## 📝 Notes

- `.env.local` est utilisé pour le développement local (`npm run dev`)
- Les variables d'environnement Vercel Dashboard sont utilisées pour la production
- Les variables `NEXT_PUBLIC_*` sont exposées au client (visible dans le HTML)
- Les autres variables restent côté serveur (non accessibles au client)

## Références

- [Vercel - Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js - Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
