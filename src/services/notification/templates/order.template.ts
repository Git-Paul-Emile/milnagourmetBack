import React from 'react';
import { render } from '@react-email/components';
import type { CommandeWithRelations } from '../../../repository/order.repository.js';
import type { ContenuNotification } from '../channel.types.js';
import { gabaritEmail, paragraphe } from './layout.js';
import { env } from '../../../config/env.js';
import {
  NewOrderEmail,
  calculerSousTotal,
  formaterMontantFcfa,
  retirerIndicatif241,
} from './NewOrderEmail.js';

export {
  NewOrderEmail,
  calculerSousTotal,
  formaterMontantFcfa,
  retirerIndicatif241,
};

/** Formate le numéro WhatsApp en retirant l'indicatif 241 pour le lien */
export function normaliserNumeroWhatsappSans241(telephone: string): string | null {
  const digits = retirerIndicatif241(telephone);
  return digits || null;
}

export function formaterDetailCommande(commande: CommandeWithRelations): string {
  let details = '';

  if (commande.elements && commande.elements.length > 0) {
    details += `Produits :\n`;
    commande.elements.forEach((element) => {
      details += `- ${element.produit?.nom ?? 'Produit'} x${element.quantite} (${element.prix} FCFA)\n`;
    });
  }

  if (commande.creationsPersonnalisees && commande.creationsPersonnalisees.length > 0) {
    if (details) details += '\n';
    details += `Créations personnalisées :\n`;
    commande.creationsPersonnalisees.forEach((creation) => {
      details += `- ${creation.taille?.nom ?? 'Création'} x${creation.quantite} (${creation.prix} FCFA)\n`;

      const fruits = creation.fruits?.map((f) => f.fruit?.nom).filter(Boolean) ?? [];
      const sauces = creation.sauces?.map((s) => s.sauce?.nom).filter(Boolean) ?? [];
      const cereales = creation.cereales?.map((c) => c.cereale?.nom).filter(Boolean) ?? [];

      if (fruits.length > 0) details += `  - Fruits : ${fruits.join(', ')}\n`;
      if (sauces.length > 0) details += `  - Sauces : ${sauces.join(', ')}\n`;
      if (cereales.length > 0) details += `  - Céréales : ${cereales.join(', ')}\n`;
      details += '\n';
    });
  }

  const sousTotal = calculerSousTotal(commande);
  details += `\nSous-total : ${sousTotal} FCFA`;
  details += `\nFrais de livraison : ${commande.fraisLivraison} FCFA`;
  details += `\nMontant total : ${commande.montantTotal} FCFA`;
  details += `\nRèglement : paiement à la livraison`;

  return details;
}

/** Notification adressée au vendeur à la réception d'une nouvelle commande via React Email. */
export async function gabaritNouvelleCommande(
  commande: CommandeWithRelations
): Promise<ContenuNotification> {
  const detail = formaterDetailCommande(commande);

  const texte =
    `🔔 Nouvelle commande ${commande.numeroCommande}\n\n` +
    `Client : ${commande.nomClient}\n` +
    `Téléphone : ${commande.telephoneClient}\n\n` +
    `${detail}\n\n` +
    `À encaisser à la livraison. Merci de traiter cette commande rapidement.`;

  const html = await render(
    React.createElement(NewOrderEmail, {
      commande,
      logoUrl: `${env.PUBLIC_APP_URL}/images/logo.png`,
    })
  );

  return {
    sujet: `Nouvelle commande ${commande.numeroCommande} - ${commande.nomClient}`,
    texte,
    html,
  };
}

/** Notification adressée au client lorsqu'une commande est livrée ou annulée. */
export function gabaritStatutCommande(
  commande: CommandeWithRelations,
  statut: 'LIVREE' | 'ANNULEE'
): ContenuNotification {
  if (statut === 'LIVREE') {
    const texte =
      `✅ Votre commande ${commande.numeroCommande} a été livrée.\n\n` +
      `Montant réglé à la livraison : ${commande.montantTotal} FCFA\n\n` +
      `Merci pour votre confiance !\n🍯 Milna Gourmet`;

    return {
      sujet: `Votre commande ${commande.numeroCommande} a été livrée`,
      texte,
      html: gabaritEmail({
        titre: 'Votre commande a été livrée',
        corpsHtml:
          paragraphe(`Bonjour ${commande.nomClient},`) +
          paragraphe(`Votre commande ${commande.numeroCommande} vient d'être livrée.`) +
          paragraphe(`Montant réglé à la livraison : ${commande.montantTotal} FCFA`) +
          paragraphe('Merci pour votre confiance !'),
      }),
    };
  }

  const texte =
    `❌ Votre commande ${commande.numeroCommande} a été annulée.\n\n` +
    `Aucun montant ne vous sera facturé.\n` +
    `Pour toute question, contactez-nous.\n\n🍯 Milna Gourmet`;

  return {
    sujet: `Votre commande ${commande.numeroCommande} a été annulée`,
    texte,
    html: gabaritEmail({
      titre: 'Votre commande a été annulée',
      corpsHtml:
        paragraphe(`Bonjour ${commande.nomClient},`) +
        paragraphe(`Votre commande ${commande.numeroCommande} a été annulée.`) +
        paragraphe("Aucun montant ne vous sera facturé : le règlement se fait uniquement à la livraison.") +
        paragraphe('Pour toute question, n’hésitez pas à nous contacter.'),
    }),
  };
}
