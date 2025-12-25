# Backend Milna Gourmet

Ce projet contient le backend de l'application Milna Gourmet, une plateforme de restauration en ligne.

## Technologies utilisées

- **Node.js** avec **Express.js** pour le serveur API
- **TypeScript** pour le typage
- **Prisma** pour l'ORM et la gestion de base de données
- **JWT** pour l'authentification
- **Swagger** pour la documentation API

## Installation

1. Assurez-vous d'avoir Node.js et pnpm installés.
2. Installez les dépendances :
   ```
   pnpm install
   ```

## Configuration

- Configurez la base de données dans `prisma/schema.prisma`.
- Copiez le fichier `.env.example` vers `.env` et remplissez les variables suivantes :
  - `DATABASE_URL` : URL de connexion à la base de données
  - `PORT` : Port du serveur (par défaut 3000)
  - `NODE_ENV` : Environnement (development/production)
  - `ACCESS_TOKEN_SECRET` : Clé secrète pour les tokens d'accès
  - `REFRESH_TOKEN_SECRET` : Clé secrète pour les tokens de rafraîchissement
  - `BCRYPT_SALT` : Sel pour le hashage des mots de passe
  - `ACCESS_TOKEN_EXPIRY` : Durée d'expiration des tokens d'accès
  - `REFRESH_TOKEN_EXPIRY` : Durée d'expiration des tokens de rafraîchissement

## Migration et seed

- Pour appliquer les migrations :
  ```
  pnpm prisma migrate dev
  ```
- Pour lancer le seed :
  ```
  pnpm run seed
  ```

## Lancement

- En mode développement :
  ```
  pnpm run dev
  ```
- En production :
  ```
  pnpm run build
  pnpm start
  ```

## API Documentation

La documentation Swagger est disponible à `/api-docs` une fois le serveur lancé.

## Structure du projet

- `src/` : Code source principal
- `prisma/` : Schéma et migrations de base de données
- `uploads/` : Fichiers uploadés (images, etc.)

## Scripts disponibles

- `pnpm run dev` : Lance le serveur en développement
- `pnpm run build` : Compile le projet
- `pnpm run start` : Lance le serveur en production
- `pnpm run seed` : Exécute le seed de la base de données 
