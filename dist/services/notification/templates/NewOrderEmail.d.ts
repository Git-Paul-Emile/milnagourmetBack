import React from 'react';
import type { CommandeWithRelations } from '../../../repository/order.repository.js';
/**
 * Formate un montant entier en FCFA avec séparateur de milliers (ex: 4 500 FCFA).
 */
export declare function formaterMontantFcfa(montant: number): string;
/**
 * Calcule le sous-total de la commande (somme des éléments et créations).
 */
export declare function calculerSousTotal(commande: CommandeWithRelations): number;
/**
 * Retire l'indicatif +241, 00241 ou 241 du numéro de téléphone pour le lien WhatsApp.
 */
export declare function retirerIndicatif241(telephone: string): string;
interface NewOrderEmailProps {
    commande: CommandeWithRelations;
    logoUrl?: string;
}
export declare const NewOrderEmail: React.FC<NewOrderEmailProps>;
export default NewOrderEmail;
//# sourceMappingURL=NewOrderEmail.d.ts.map