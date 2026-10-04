/**
 * Filet de sécurité global sur toute l'API.
 * Volontairement généreux : il n'attrape que les abus francs et ne doit
 * jamais gêner un usage normal, même intensif (dashboard admin).
 */
export declare const globalLimiter: import("express-rate-limit").RateLimitRequestHandler;
/** Authentification : cible privilégiée du bourrage de mots de passe. */
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
/** Renouvellement de token : appelé souvent, donc plus permissif. */
export declare const refreshLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Création de commande.
 *
 * L'endpoint est public (un visiteur non connecté peut commander) et
 * déclenche un envoi de notification : c'est la cible la plus rentable
 * pour un script malveillant. 10 commandes par heure et par IP couvrent
 * largement l'usage réel, y compris plusieurs clients derrière une même
 * connexion partagée.
 */
export declare const orderLimiter: import("express-rate-limit").RateLimitRequestHandler;
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
export declare const passwordResetLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rateLimiter.d.ts.map