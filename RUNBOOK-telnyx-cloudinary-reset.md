# Runbook — Bascule Telnyx + nouveau Cloudinary + reset base

Ces étapes s'exécutent **depuis ta machine** (dossier `back/`), qui a accès à
Internet, à la base Neon et à Cloudinary. L'environnement d'assistance n'a pas
d'accès réseau : il a préparé tout le code et la configuration, mais ne peut ni
joindre Neon ni appeler Cloudinary/Telnyx.

## Ce qui est déjà fait (code)

- **Messagerie** : le transport passe de 360dialog à **Telnyx**
  (`src/services/whatsapp.service.ts`). L'API publique du service est
  inchangée ; les 3 points d'appel n'ont pas bougé.
- **Config env** : variables `TELNYX_*` ajoutées (`src/config/env.ts`,
  `.env`, `.env.example`) ; anciennes variables Twilio et 360dialog retirées.
- **Cloudinary** : `CLOUDINARY_URL` du `.env` pointe sur le nouveau compte
  (`iujorfq3`). Le front (`front/src/constants/media.ts`) aussi.
- **Base** : la migration `init` ne contient plus la table `themes`.
  `prisma.seed` est configuré pour que `migrate reset` relance le seed.

## Étape 1 — Compléter le `.env` (secrets)

`CLOUDINARY_URL` est déjà renseigné. À remplir quand le compte Telnyx sera
prêt (le reste fonctionne sans, les notifications sont simplement ignorées) :

```
TELNYX_API_KEY=            # portail Telnyx > API Keys
TELNYX_WHATSAPP_FROM=      # numéro WhatsApp Business expéditeur (E.164)
TELNYX_MESSAGING_PROFILE_ID=
```

## Étape 2 — Peupler le nouveau Cloudinary (compte vide)

Le nouveau compte ne contient encore aucune image. Le seed écrit des URLs
Cloudinary en base ; les fichiers doivent donc exister côté Cloudinary, sinon
les images s'afficheront cassées. Les sources sont dans `back/uploads/`.

```bash
cd back
npm run migrate:cloudinary
```

Ce script téléverse `back/uploads/**` vers `milnagourmet/**` sur le nouveau
compte, avec les mêmes chemins que ceux attendus par le seed :

- `milnagourmet/produits/yogurt-nature.jpg`, `.../yogurt-liquid.jpg`
- `milnagourmet/banners/hero-banner.jpg`
- `milnagourmet/creation/yogurt-creation.jpg`
- `milnagourmet/logos/milna-logo.png`
- `milnagourmet/avatarToast/milna-owner.jpg`
- `milnagourmet/temoignages/milna-owner.jpg`

> Manque `milnagourmet/services/panier-gourmand.jpg` (pas de source dans
> `uploads/`). La carte du service « Panier gourmand » aura une image cassée
> tant que tu ne l'auras pas téléversée. Si tu as les images des services,
> le script `scripts/setup-services-and-images.ts` sait les gérer.

## Étape 3 — Reset + seed de la base

`migrate reset` **supprime toutes les données**, ré-applique les migrations,
puis relance le seed automatiquement (grâce à `prisma.seed`).

```bash
cd back
npx prisma migrate reset
```

Alternative sans supprimer l'historique de migration (applique les migrations
existantes puis seed manuel) :

```bash
npx prisma migrate deploy
npm run seed
```

## Étape 4 — Vérifier

```bash
cd back && npm run build     # compile TypeScript + génère le client Prisma
```

- Ouvre le site : les images produits/hero/témoignages doivent s'afficher
  depuis `res.cloudinary.com/iujorfq3/...`.
- Passe une commande de test : sans clés Telnyx, la notification est ignorée
  (log d'avertissement), aucune erreur bloquante. Avec les clés, elle part.

## Ordre recommandé

```
1. .env (Cloudinary déjà fait ; Telnyx quand prêt)
2. npm run migrate:cloudinary      # peuple le nouveau Cloudinary
3. npx prisma migrate reset        # reset + seed
4. npm run build                   # contrôle
```
