export declare class PasswordResetService {
    /**
     * Étape 1 — demande de réinitialisation.
     *
     * Ne lève jamais d'erreur « compte introuvable » : le contrôleur
     * renvoie systématiquement le même message de succès.
     */
    static demanderReinitialisation(email: string): Promise<void>;
    /**
     * Étape 2 — application du nouveau mot de passe.
     *
     * Ici, à l'inverse de l'étape 1, les erreurs sont explicites : la
     * personne détient déjà le lien, lui dire qu'il a expiré est utile et
     * ne révèle rien d'exploitable.
     */
    static reinitialiser(jetonEnClair: string, nouveauMotDePasse: string): Promise<void>;
    /**
     * Purge des jetons expirés ou consommés depuis plus de 7 jours.
     * À appeler périodiquement : sans cela la table croît indéfiniment.
     */
    static purgerJetonsObsoletes(): Promise<number>;
    /** Exposée pour les tests et l'affichage côté client. */
    static get dureeValiditeMinutes(): number;
}
//# sourceMappingURL=passwordReset.service.d.ts.map