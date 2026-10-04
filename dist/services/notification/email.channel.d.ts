import type { CanalEnvoi, ContenuNotification, DestinatairesNotification } from './channel.types.js';
/**
 * Canal email, adossé à Resend (API HTTP).
 *
 * Pourquoi une API HTTP plutôt que du SMTP ? Le SMTP ouvre une connexion
 * persistante et se comporte mal derrière les hébergeurs qui bloquent le
 * port 587 (cas fréquent). Une requête HTTPS passe partout et remonte une
 * erreur exploitable immédiatement.
 *
 * Le client Resend est instancié paresseusement (lazy) : sans clé API, le
 * module se charge quand même et le canal se déclare simplement « non
 * configuré ». L'application démarre donc en développement sans compte
 * Resend.
 */
declare class EmailChannel implements CanalEnvoi {
    readonly nom: "email";
    private client;
    estConfigure(): boolean;
    resoudreDestinataire(destinataires: DestinatairesNotification): string | null;
    envoyer(destinataire: string, contenu: ContenuNotification): Promise<void>;
    private obtenirClient;
}
/**
 * Échappe les caractères ayant un sens en HTML.
 * Indispensable dès qu'on injecte une donnée saisie par un utilisateur
 * (nom du client, notes de commande) dans un email HTML : sans cela, un
 * nom contenant `<script>` serait interprété par le client mail.
 */
export declare function echapperHtml(valeur: string): string;
export declare const emailChannel: EmailChannel;
export {};
//# sourceMappingURL=email.channel.d.ts.map