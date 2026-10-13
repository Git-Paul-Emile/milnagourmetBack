import type { CommandeWithRelations } from '../../../repository/order.repository.js';
import type { ContenuNotification } from '../channel.types.js';
import { NewOrderEmail, calculerSousTotal, formaterMontantFcfa, retirerIndicatif241 } from './NewOrderEmail.js';
export { NewOrderEmail, calculerSousTotal, formaterMontantFcfa, retirerIndicatif241, };
/** Formate le numéro WhatsApp en retirant l'indicatif 241 pour le lien */
export declare function normaliserNumeroWhatsappSans241(telephone: string): string | null;
export declare function formaterDetailCommande(commande: CommandeWithRelations): string;
/** Notification adressée au vendeur à la réception d'une nouvelle commande via React Email. */
export declare function gabaritNouvelleCommande(commande: CommandeWithRelations): Promise<ContenuNotification>;
/** Notification adressée au client lorsqu'une commande est livrée ou annulée. */
export declare function gabaritStatutCommande(commande: CommandeWithRelations, statut: 'LIVREE' | 'ANNULEE'): ContenuNotification;
//# sourceMappingURL=order.template.d.ts.map