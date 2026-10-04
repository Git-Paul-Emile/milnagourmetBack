/**
 * Gabarit HTML commun à tous les emails transactionnels.
 *
 * Contraintes propres à l'email (très différentes du web) :
 *   - pas de feuille de style externe ni de <style> fiable : les styles
 *     doivent être en ligne, attribut par attribut ;
 *   - pas de flexbox ni de grid : la mise en page se fait avec des
 *     <table>, seul élément rendu de façon homogène par Outlook, Gmail
 *     et les clients mobiles ;
 *   - largeur maximale de 600 px, standard historique de l'email.
 */
export declare function gabaritEmail(options: {
    titre: string;
    corpsHtml: string;
    piedDePage?: string;
}): string;
/** Paragraphe stylé, prêt à insérer dans le gabarit. */
export declare function paragraphe(texte: string): string;
/** Bloc préformaté pour le détail d'une commande (conserve les retours à la ligne). */
export declare function blocPreformate(texte: string): string;
/** Bouton d'action principal (rendu en table pour Outlook). */
export declare function bouton(libelle: string, url: string): string;
//# sourceMappingURL=layout.d.ts.map