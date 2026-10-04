import type { CommandeWithRelations } from '../../../repository/order.repository.js';
import type { ContenuNotification } from '../channel.types.js';
/**
 * Gabarits liés aux commandes.
 *
 * Un seul endroit produit le contenu, quel que soit le canal : le texte
 * WhatsApp et l'email disent donc toujours exactement la même chose
 * (principe DRY). Ajouter une information à la commande ne demande qu'une
 * seule modification.
 */
/** Formate le détail d'une commande en texte brut, utilisable partout. */
export declare function formaterDetailCommande(commande: CommandeWithRelations): string;
/** Notification adressée au vendeur à la réception d'une nouvelle commande. */
export declare function gabaritNouvelleCommande(commande: CommandeWithRelations): ContenuNotification;
/** Notification adressée au client lorsqu'une commande est livrée ou annulée. */
export declare function gabaritStatutCommande(commande: CommandeWithRelations, statut: 'LIVREE' | 'ANNULEE'): ContenuNotification;
//# sourceMappingURL=order.template.d.ts.map