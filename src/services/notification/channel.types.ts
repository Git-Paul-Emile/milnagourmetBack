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

export type CanalNotification = 'whatsapp' | 'email';

/**
 * Coordonnées connues d'un destinataire.
 * Les deux champs sont facultatifs : un client peut n'avoir qu'un
 * téléphone (cas majoritaire) ou qu'un email.
 */
export interface DestinatairesNotification {
  telephone?: string | null;
  email?: string | null;
}

/**
 * Contenu à transmettre, décliné pour tous les canaux.
 *
 * - `texte` est obligatoire : c'est le corps WhatsApp, et le repli
 *   texte brut de l'email (utile pour les clients mail sans HTML et pour
 *   la délivrabilité — un email sans version texte est plus souvent
 *   classé en indésirable).
 * - `sujet` et `html` ne servent qu'à l'email et sont ignorés ailleurs.
 */
export interface ContenuNotification {
  sujet: string;
  texte: string;
  html?: string;
}

export interface CanalEnvoi {
  /** Identifiant du canal, journalisé et stocké en base. */
  readonly nom: CanalNotification;

  /**
   * Le canal dispose-t-il de toute sa configuration ?
   * Un canal non configuré n'est jamais sélectionné.
   */
  estConfigure(): boolean;

  /**
   * Extrait l'adresse utilisable par ce canal, ou `null` si le
   * destinataire n'est pas joignable par ce moyen.
   */
  resoudreDestinataire(destinataires: DestinatairesNotification): string | null;

  /**
   * Envoie effectivement le message.
   * Doit lever une exception en cas d'échec : l'orchestrateur s'occupe
   * des reprises et de la journalisation.
   */
  envoyer(destinataire: string, contenu: ContenuNotification): Promise<void>;
}

/** Résultat d'une tentative d'acheminement, tracé en base pour les commandes. */
export interface ResultatNotification {
  succes: boolean;
  canal: CanalNotification | null;
  tentatives: number;
  erreur?: string;
}
