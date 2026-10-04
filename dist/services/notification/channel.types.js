/**
 * Contrat commun à tous les canaux de notification.
 *
 * Objectif : le reste de l'application (contrôleur de commandes, service
 * d'authentification…) ne doit JAMAIS savoir si le message part par
 * WhatsApp ou par email. Elle demande « préviens ce destinataire », et la
 * couche notification choisit le canal disponible.
 *
 * C'est le principe d'inversion de dépendance (le « D » de SOLID) : les
 * modules métier dépendent de cette abstraction, pas de Telnyx ni de
 * Resend. Le jour où WhatsApp Business est activé, aucun contrôleur ne
 * change — seule la disponibilité du canal change.
 */
export {};
//# sourceMappingURL=channel.types.js.map