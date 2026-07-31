import { env } from "./env.js";
import { logger } from "./logger.js";
import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
// Import nommé : le tsconfig active `verbatimModuleSyntax`, qui interdit
// l'import par défaut d'un module CommonJS sans interopérabilité explicite.
import { pinoHttp } from "pino-http";
import type { IncomingMessage } from "node:http";
import { randomUUID } from "node:crypto";

import categorieRoute from "../routes/categorie.route.js";
import creationRoute from "../routes/creation.route.js";
import siteRoute from "../routes/site.route.js";
import productRoute from "../routes/product.route.js";
import deliveryZoneRoute from "../routes/deliveryZone.route.js";
import deliveryPersonRoute from "../routes/deliveryPerson.route.js";
import authRoute from "../routes/auth.route.js";
import orderRoute from "../routes/order.route.js";
import cartRoute from "../routes/cart.route.js";
import configRoute from "../routes/config.route.js";
import userRoute from "../routes/user.route.js";
import uploadRoute from "../routes/upload.route.js";
import healthRoute from "../routes/health.route.js";
import loyaltyRoute from "../routes/loyalty.route.js";
import specialServiceRoute from "../routes/specialService.route.js";

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';

import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError.js";
import { globalLimiter } from "../middleware/rateLimiter.js";
import { requireAdmin } from "../utils/admin.middleware.js";
import type { Request, Response, NextFunction } from "express";

const app: Application = express();

// ---------------------------------------------------------------------
// 1. Confiance dans le proxy
// ---------------------------------------------------------------------
// Render, Vercel et tous les hébergeurs placent un reverse proxy devant
// l'application. Sans `trust proxy`, `req.ip` vaut l'adresse du proxy :
// tous les visiteurs partagent alors le même compteur de rate limiting
// (qui devient inopérant) et `secure` sur les cookies est mal évalué.
// La valeur 1 signifie « fais confiance à un seul proxy en amont ».
app.set("trust proxy", 1);

// ---------------------------------------------------------------------
// 2. Journalisation des requêtes
// ---------------------------------------------------------------------
// Placée en tout premier pour que même les requêtes rejetées (CORS,
// rate limiting) laissent une trace. `genReqId` attribue un identifiant
// unique à chaque requête : il se retrouve dans tous les logs qu'elle
// produit, ce qui permet de reconstituer un incident de bout en bout.
app.use(
  pinoHttp({
    logger,
    genReqId: (req: IncomingMessage) =>
      (req.headers["x-request-id"] as string | undefined) ?? randomUUID(),
    // Le health check est appelé toutes les 30 s par les sondes : le
    // journaliser en info noierait tout le reste.
    autoLogging: {
      ignore: (req: IncomingMessage) =>
        req.url === "/api/health" || req.url === "/api/health/",
    },
  })
);

// ---------------------------------------------------------------------
// 3. En-têtes de sécurité HTTP
// ---------------------------------------------------------------------
// helmet pose une dizaine d'en-têtes qui demandent au navigateur de
// refuser certains comportements : affichage dans une iframe tierce
// (clickjacking), interprétation d'un fichier selon son contenu plutôt
// que son type déclaré (X-Content-Type-Options), fuite du référent, etc.
app.use(
  helmet({
    // L'API ne sert que du JSON : une Content-Security-Policy n'y protège
    // rien et casserait l'interface Swagger. Elle se configure côté front
    // (en-têtes Vercel), là où du HTML est réellement rendu.
    contentSecurityPolicy: false,
    // Autorise le front (autre origine) à charger les ressources servies
    // par l'API, notamment les images du dossier /uploads.
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Compression gzip/brotli des réponses : divise par ~3 à 5 la taille des
// listes JSON. Gain immédiat et visible sur connexion mobile.
app.use(compression());

// ---------------------------------------------------------------------
// 4. CORS
// ---------------------------------------------------------------------
// Le navigateur bloque par défaut les appels d'une origine A vers une API
// d'origine B. CORS est la liste explicite des origines autorisées.
// Les adresses localhost ne sont ajoutées qu'en dehors de la production.
const allowedOrigins = [
  env.FRONT_URL,
  ...(env.CORS_ORIGINS ? env.CORS_ORIGINS.split(',').map((o) => o.trim()) : []),
  ...(env.NODE_ENV !== 'production'
    ? ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081']
    : []),
].filter((origin): origin is string => Boolean(origin));

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
    // Requêtes sans en-tête Origin : outils serveur à serveur (curl,
    // sondes de monitoring). Les navigateurs envoient toujours Origin sur
    // une requête cross-origin, ce cas ne contourne donc rien.
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);

    logger.warn({ origin }, 'Requête rejetée par la politique CORS');
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  credentials: true,
};

app.use(cors(corsOptions));

// ---------------------------------------------------------------------
// 5. Parsers
// ---------------------------------------------------------------------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ---------------------------------------------------------------------
// 6. Filet de sécurité global contre les abus
// ---------------------------------------------------------------------
// Volontairement large : les limites strictes sont posées route par route
// (authentification, création de commande, réinitialisation de mot de passe).
app.use('/api', globalLimiter);

// ---------------------------------------------------------------------
// 7. Routes
// ---------------------------------------------------------------------
app.use('/api/auth', authRoute);
app.use('/api/categories', categorieRoute);
app.use('/api/creation', creationRoute);
app.use('/api/site', siteRoute);
app.use('/api/products', productRoute);
app.use('/api/delivery-zones', deliveryZoneRoute);
app.use('/api/delivery-persons', deliveryPersonRoute);
app.use('/api/orders', orderRoute);
app.use('/api/cart', cartRoute);
app.use('/api/config', configRoute);
app.use('/api/users', userRoute);
app.use('/api/upload', uploadRoute);
app.use('/api/health', healthRoute);
app.use('/api/loyalty', loyaltyRoute);
app.use('/api/services', specialServiceRoute);

// Documentation Swagger : elle décrit l'intégralité de la surface d'API,
// y compris les routes d'administration. En production elle est réservée
// aux administrateurs authentifiés plutôt qu'ouverte à tous.
if (env.NODE_ENV === 'production') {
  app.use('/api-docs', requireAdmin, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} else {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

// ---------------------------------------------------------------------
// 8. Route inconnue
// ---------------------------------------------------------------------
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ status: 'error', message: "Route non trouvée" });
});

// ---------------------------------------------------------------------
// 9. Gestionnaire d'erreurs global
// ---------------------------------------------------------------------
// Règle de conduite : journaliser tout côté serveur, ne rien révéler au
// client. Un message d'erreur Prisma brut expose les noms de tables et de
// colonnes — c'est de la reconnaissance offerte à un attaquant.
interface PrismaLikeError extends Error {
  code?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: PrismaLikeError | AppError, req: Request, res: Response, next: NextFunction) => {
  let error: AppError;

  if (err instanceof AppError) {
    // Erreur métier maîtrisée : son message est écrit pour l'utilisateur,
    // il peut être transmis tel quel.
    error = err;
  } else if ('code' in err && err.code === 'P2002') {
    error = new AppError('Valeur dupliquée', StatusCodes.BAD_REQUEST);
  } else if ('code' in err && err.code === 'P2025') {
    error = new AppError('Ressource non trouvée', StatusCodes.NOT_FOUND);
  } else {
    // Erreur inattendue : trace complète dans les logs, message générique
    // au client.
    (req.log ?? logger).error(
      { err, path: req.path, method: req.method },
      'Erreur non gérée'
    );
    error = new AppError('Erreur interne du serveur', StatusCodes.INTERNAL_SERVER_ERROR);
  }

  res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
    // La pile d'appel n'est exposée qu'en développement local. Elle est
    // exclue en production (fuite d'information) comme en test (les
    // tests doivent valider la réponse réellement servie aux clients).
    ...(env.NODE_ENV === 'development' && err.stack ? { stack: err.stack } : {}),
  });
});

export default app;
