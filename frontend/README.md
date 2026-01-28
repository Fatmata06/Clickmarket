# ClickMarket — Frontend

Application web Next.js pour ClickMarket.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui + Radix UI
- Lucide icons

## Démarrage

```bash
npm install
npm run dev
```

Ouvrir http://localhost:3000.

## Configuration

Créer un fichier `frontend/.env.local` :

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Structure (extraits)

- `app/` : routes et pages
- `components/` : composants UI
- `context/` : contextes (auth, panier)
- `lib/` : utilitaires et services API

## Notes

- Le backend doit être démarré et accessible via `NEXT_PUBLIC_API_URL`.
- Les pages protégées se trouvent dans `app/(protected)`.
