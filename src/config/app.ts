import express, { type Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
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

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../swagger.js';

import { StatusCodes } from "http-status-codes";
import { AppError } from "../utils/AppError.js";






const app: Application = express();


// Configuration CORS
// Autoriser l'origine du front (par défaut Vite: 8080)
const allowedOrigins = [
  process.env.FRONT_URL || 'http://localhost:8080',
  'http://localhost:5173', // Vite default
  'http://localhost:8081',
  'https://milnagourmet-front.vercel.app' // URL de production Vercel
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


// Servir les fichiers statiques du dossier uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));


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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// Middleware pour routes non trouvées
app.use((req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({ message: "Route non trouvée" });
});

// Middleware de gestion des erreurs
app.use((err: any, req: any, res: any, next: any) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  console.error(err);

  // Prisma errors
  if (err.code) {
    // Handle specific Prisma error codes
    if (err.code === 'P2002') {
      const message = 'Valeur dupliquée';
      error = new AppError(message, 400);
    } else if (err.code === 'P2025') {
      const message = 'Ressource non trouvée';
      error = new AppError(message, 404);
    } else {
      const message = 'Erreur de base de données';
      error = new AppError(message, 500);
    }
  }

  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Erreur interne du serveur',
  });
});

export default app;
