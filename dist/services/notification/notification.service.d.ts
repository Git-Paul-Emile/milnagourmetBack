import type { CommandeWithRelations } from '../../repository/order.repository.js';
import type { CanalEnvoi, ContenuNotification, DestinatairesNotification, ResultatNotification } from './channel.types.js';
export declare class NotificationService {
    /**
     * Sélectionne le premier canal à la fois configuré ET capable de
     * joindre ce destinataire.
     *
     * Le double test est important : le canal WhatsApp peut être configuré
     * alors que ce client précis n'a pas de téléphone renseigné — il faut
     * alors continuer vers l'email plutôt qu'échouer.
     */
    static choisirCanal(destinataires: DestinatairesNotification): {
        canal: CanalEnvoi;
        adresse: string;
    } | null;
    private static choisirCanalDisponible;
    /**
     * Envoie un message avec reprise (retry) à attente exponentielle :
     * 500 ms, puis 1 s, puis 2 s.
     *
     * Pourquoi une attente croissante ? Un service tiers momentanément
     * saturé se rétablit en quelques secondes. Réessayer immédiatement en
     * boucle aggrave sa charge ; espacer les tentatives lui laisse le temps
     * de repartir, sans bloquer l'appelant longtemps.
     *
     * Cette méthode ne lève jamais d'exception : elle retourne un résultat.
     * L'appelant décide quoi en faire (tracer, alerter, ignorer).
     */
    static envoyer(destinataires: DestinatairesNotification, contenu: ContenuNotification, contexte?: Record<string, unknown>): Promise<ResultatNotification>;
    private static envoyerAvecCanaux;
    /**
     * Prévient le vendeur d'une nouvelle commande, puis inscrit le résultat
     * dans la commande elle-même.
     *
     * Persister l'état transforme un effet de bord volatil en donnée : le
     * dashboard peut afficher « commande non notifiée » et proposer un
     * renvoi. Sans cela, une panne du fournisseur reste invisible.
     */
    static notifierVendeurNouvelleCommande(commande: CommandeWithRelations): Promise<ResultatNotification>;
    /** Prévient le client du passage de sa commande en livrée ou annulée. */
    static notifierClientStatutCommande(commande: CommandeWithRelations & {
        emailClient?: string | null;
    }, statut: 'LIVREE' | 'ANNULEE'): Promise<ResultatNotification>;
    /**
     * Envoie le lien de réinitialisation de mot de passe.
     * Toujours par email, jamais par WhatsApp (voir le gabarit).
     */
    static envoyerLienReinitialisation(options: {
        email: string;
        nomComplet: string;
        lien: string;
        dureeValiditeMinutes: number;
    }): Promise<ResultatNotification>;
    /** Confirme au client que son mot de passe a bien été changé. */
    static confirmerChangementMotDePasse(email: string | null | undefined, nomComplet: string): Promise<void>;
    /** Inscrit le résultat d'une notification sur la commande concernée. */
    private static tracerResultat;
}
//# sourceMappingURL=notification.service.d.ts.map