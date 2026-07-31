import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import type { Request } from 'express';
import { env } from '../config/env.js';

/**
 * Limitation de débit (rate limiting).
 *
 * Principe : chaque client (identifié par son IP) dispose d'un quota de N
 * requêtes par fenêtre de M minutes. Au-delà, le serveur répond 429 sans
 * exécuter le traitement. Cela protège contre :
 *   - le bourrage de mots de passe (brute force) sur /login ;
 *   - le spam de commandes sur un endpoint public ;
 *   - la saturation du serveur par un script.
 *
 * Limite connue : le compteur est stocké en mémoire. Avec plusieurs
 * instances, chacune a son propre compteur — il faudrait alors un store
 * partagé (Redis). Pour une instance unique, c'est suffisant.
 *
 * Les limiteurs sont neutralisés en environnement de test, sinon les
 * suites d'intégration déclenchent le 429 au bout de quelques requêtes.
 */
const desactiveEnTest = () => env.NODE_ENV === 'test';

const reponse429 = (message: string) => ({ status: 'error', message });

/**
 * Filet de sécurité global sur toute l'API.
 * Volontairement généreux : il n'attrape que les abus francs et ne doit
 * jamais gêner un usage normal, même intensif (dashboard admin).
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 1000,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: desactiveEnTest,
  message: reponse429('Trop de requêtes, réessayez dans quelques minutes.'),
});

/** Authentification : cible privilégiée du bourrage de mots de passe. */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: desactiveEnTest,
  message: reponse429('Trop de tentatives, réessayez dans 15 minutes.'),
});

/** Renouvellement de token : appelé souvent, donc plus permissif. */
export const refreshLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: desactiveEnTest,
  message: reponse429('Trop de requêtes, réessayez dans une minute.'),
});

/**
 * Création de commande.
 *
 * L'endpoint est public (un visiteur non connecté peut commander) et
 * déclenche un envoi de notification : c'est la cible la plus rentable
 * pour un script malveillant. 10 commandes par heure et par IP couvrent
 * largement l'usage réel, y compris plusieurs clients derrière une même
 * connexion partagée.
 */
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: desactiveEnTest,
  message: reponse429(
    "Trop de commandes envoyées depuis cette connexion. Réessayez dans une heure ou contactez-nous."
  ),
});

/**
 * Demande de réinitialisation de mot de passe.
 *
 * Double protection :
 *   - par IP : empêche un script de balayer des milliers d'adresses ;
 *   - par email demandé : empêche de harceler la boîte d'une personne.
 *
 * `ipKeyGenerator` normalise l'IP (en IPv6 notamment, l'adresse brute
 * n'est pas un identifiant fiable car un client dispose d'un préfixe
 * entier). Il faut toujours passer par lui plutôt que d'utiliser `req.ip`
 * tel quel dans un `keyGenerator` personnalisé.
 */
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  limit: 5,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: desactiveEnTest,
  keyGenerator: (req: Request) => {
    const body = req.body as { email?: unknown } | undefined;
    const email = typeof body?.email === 'string' ? body.email.toLowerCase().trim() : '';
    return `${ipKeyGenerator(req.ip ?? '')}:${email}`;
  },
  message: reponse429('Trop de demandes de réinitialisation. Réessayez dans une heure.'),
});
