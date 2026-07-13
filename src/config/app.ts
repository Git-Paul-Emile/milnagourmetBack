import { env } from "./env.js";
import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
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
import themeRoute from "../routes/theme.route.js";
import healthRoute from "../routes/health.route.js";
import loyaltyRoute from "../routes/loyalty.route.js";
import specialServiceRoute from "../routes/specialService.route.js";

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';

import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError.js";
import type { Request, Response, NextFunction } from "express";






const app: Application = express();


// Configuration CORS
// Autoriser l'origine du front (par défaut Vite: 8080)
const allowedOrigins = [
  env.FRONT_URL,
  ...(env.CORS_ORIGINS ? env.CORS_ORIGINS.split(',') : []),
  'http://localhost:8080',
  'http://localhost:8081'
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
    // Allow requests with no origin (e.g., curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('CORS policy: origin not allowed'), false);
  },
  credentials: true,
};


app.use(cors(corsOptions));


// Parser JSON et cookies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());


// Routes
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
app.use('/api/themes', themeRoute);
app.use('/api/health', healthRoute);
app.use('/api/loyalty', loyaltyRoute);
app.use('/api/services', specialServiceRoute);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// Middleware pour routes non trouvées
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Route non trouvée" });
});

// Middleware de gestion des erreurs
interface PrismaLikeError extends Error {
  code?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: PrismaLikeError | AppError, req: Request, res: Response, next: NextFunction) => {
  let error: AppError;

  // Log error
  console.error(err);

  // Prisma errors
  if ('code' in err && err.code) {
    // Handle specific Prisma error codes
    if (err.code === 'P2002') {
      error = new AppError('Valeur dupliquée', StatusCodes.BAD_REQUEST);
    } else if (err.code === 'P2025') {
      error = new AppError('Ressource non trouvée', StatusCodes.NOT_FOUND);
    } else {
      error = new AppError('Erreur de base de données', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  } else if (err instanceof AppError) {
    error = err;
  } else {
    error = new AppError(err.message || 'Erreur interne du serveur', StatusCodes.INTERNAL_SERVER_ERROR);
  }

  res.status(error.statusCode).json({
    status: 'error',
    message: error.message,
  });
});

export default app;
