import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Html, Head, Preview, Body, Container, Section, Text, Link, Img, } from '@react-email/components';
/**
 * Formate un montant entier en FCFA avec séparateur de milliers (ex: 4 500 FCFA).
 */
export function formaterMontantFcfa(montant) {
    const formate = Math.round(montant)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formate} FCFA`;
}
/**
 * Calcule le sous-total de la commande (somme des éléments et créations).
 */
export function calculerSousTotal(commande) {
    const totalElements = (commande.elements ?? []).reduce((acc, el) => acc + (el.prix || 0) * (el.quantite || 1), 0);
    const totalCreations = (commande.creationsPersonnalisees ?? []).reduce((acc, cr) => acc + (cr.prix || 0) * (cr.quantite || 1), 0);
    const total = totalElements + totalCreations;
    if (total > 0)
        return total;
    return Math.max(0, (commande.montantTotal || 0) - (commande.fraisLivraison || 0));
}
/**
 * Retire l'indicatif +241, 00241 ou 241 du numéro de téléphone pour le lien WhatsApp.
 */
export function retirerIndicatif241(telephone) {
    const brut = telephone.trim().replace(/[\s.-]+/g, '');
    if (brut.startsWith('+241')) {
        return brut.slice(4);
    }
    if (brut.startsWith('00241')) {
        return brut.slice(5);
    }
    if (brut.startsWith('241')) {
        return brut.slice(3);
    }
    return brut;
}
export const NewOrderEmail = ({ commande, logoUrl = 'https://milnagourmet.com/images/logo.png', }) => {
    const sousTotal = calculerSousTotal(commande);
    const fraisLivraison = commande.fraisLivraison ?? 0;
    const montantTotal = commande.montantTotal ?? 0;
    const whatsappLien = `https://wa.me/${retirerIndicatif241(commande.telephoneClient)}`;
    return (_jsxs(Html, { lang: "fr", children: [_jsx(Head, {}), _jsx(Preview, { children: `Nouvelle commande ${commande.numeroCommande} - ${commande.nomClient}` }), _jsx(Body, { style: mainBodyStyle, children: _jsxs(Container, { style: containerStyle, children: [_jsx(Section, { style: logoSectionStyle, children: _jsx(Img, { src: logoUrl, width: "94", height: "94", alt: "Milna Gourmet", style: logoImgStyle }) }), _jsxs(Section, { style: introSectionStyle, children: [_jsx(Text, { style: introTextStyle, children: "Une nouvelle commande vient d'\u00EAtre enregistr\u00E9e sur Milna Gourmet." }), _jsx(Text, { style: introSubtextStyle, children: "Voici le r\u00E9capitulatif :" })] }), _jsxs(Section, { style: cardProduitsStyle, children: [_jsx("div", { style: produitsHeaderStyle, children: "PRODUITS" }), commande.elements &&
                                    commande.elements.map((element, index) => {
                                        const totalItem = (element.prix || 0) * (element.quantite || 1);
                                        const nomProduit = element.produit?.nom || 'Produit';
                                        return (_jsx("div", { style: produitRowStyle, children: _jsx("table", { role: "presentation", width: "100%", cellPadding: "0", cellSpacing: "0", children: _jsx("tbody", { children: _jsxs("tr", { children: [_jsx("td", { style: produitNomColStyle, children: `${nomProduit} x${element.quantite} (${formaterMontantFcfa(element.prix)})` }), _jsx("td", { style: produitPrixColStyle, children: formaterMontantFcfa(totalItem) })] }) }) }) }, element.id ?? `elem-${index}`));
                                    }), commande.creationsPersonnalisees &&
                                    commande.creationsPersonnalisees.map((creation, index) => {
                                        const totalItem = (creation.prix || 0) * (creation.quantite || 1);
                                        const nomTaille = creation.taille?.nom || 'Création';
                                        const fruits = creation.fruits?.map((f) => f.fruit?.nom).filter(Boolean) || [];
                                        const sauces = creation.sauces?.map((s) => s.sauce?.nom).filter(Boolean) || [];
                                        const cereales = creation.cereales?.map((c) => c.cereale?.nom).filter(Boolean) || [];
                                        const detailsIngr = [...fruits, ...sauces, ...cereales].join(', ');
                                        return (_jsx("div", { style: produitRowStyle, children: _jsx("table", { role: "presentation", width: "100%", cellPadding: "0", cellSpacing: "0", children: _jsx("tbody", { children: _jsxs("tr", { children: [_jsxs("td", { style: produitNomColStyle, children: [_jsx("div", { children: `Création personnalisée ${nomTaille} x${creation.quantite} (${formaterMontantFcfa(creation.prix)})` }), detailsIngr ? (_jsx("div", { style: ingredientDetailStyle, children: detailsIngr })) : null] }), _jsx("td", { style: produitPrixColStyle, children: formaterMontantFcfa(totalItem) })] }) }) }) }, creation.id ?? `creat-${index}`));
                                    }), _jsx("div", { style: sousTotalRowStyle, children: _jsx("table", { role: "presentation", width: "100%", cellPadding: "0", cellSpacing: "0", children: _jsx("tbody", { children: _jsxs("tr", { children: [_jsx("td", { style: sousTotalLabelStyle, children: "Sous-total" }), _jsx("td", { style: sousTotalValeurStyle, children: formaterMontantFcfa(sousTotal) })] }) }) }) }), _jsx("div", { style: livraisonRowStyle, children: _jsx("table", { role: "presentation", width: "100%", cellPadding: "0", cellSpacing: "0", children: _jsx("tbody", { children: _jsxs("tr", { children: [_jsx("td", { style: livraisonLabelStyle, children: "Frais de livraison" }), _jsx("td", { style: livraisonValeurStyle, children: formaterMontantFcfa(fraisLivraison) })] }) }) }) }), _jsx("div", { style: totalRowStyle, children: _jsx("table", { role: "presentation", width: "100%", cellPadding: "0", cellSpacing: "0", children: _jsx("tbody", { children: _jsxs("tr", { children: [_jsx("td", { style: totalLabelStyle, children: "Montant total" }), _jsx("td", { style: totalValeurStyle, children: formaterMontantFcfa(montantTotal) })] }) }) }) }), _jsx("div", { style: reglementFooterStyle, children: "R\u00E8glement : paiement \u00E0 la livraison" })] }), _jsxs(Section, { style: cardClientStyle, children: [_jsx(Text, { style: clientCardTitleStyle, children: "INFORMATIONS CLIENT" }), _jsx(Text, { style: clientFieldLabelStyle, children: "CLIENT" }), _jsx(Text, { style: clientFieldValueStyle, children: commande.nomClient }), _jsx("div", { style: clientDividerStyle }), _jsx(Text, { style: clientFieldLabelStyle, children: "T\u00C9L\u00C9PHONE" }), _jsx("div", { style: { margin: '0 0 14px 0' }, children: _jsx(Link, { href: whatsappLien, style: whatsappLinkStyle, children: commande.telephoneClient }) }), _jsx("div", { style: clientDividerStyle }), _jsx(Text, { style: clientFieldLabelStyle, children: "MODE DE R\u00C8GLEMENT" }), _jsx(Text, { style: clientFieldValueStyleNoMargin, children: "Paiement \u00E0 la livraison" })] }), _jsx(Section, { style: cardEncaissementStyle, children: _jsx("table", { role: "presentation", width: "100%", cellPadding: "0", cellSpacing: "0", children: _jsx("tbody", { children: _jsxs("tr", { children: [_jsxs("td", { style: encaissementColLeftStyle, children: [_jsx("div", { style: encaissementLabelStyle, children: "\u00C0 ENCAISSER \u00C0 LA LIVRAISON" }), _jsx("div", { style: encaissementMontantStyle, children: formaterMontantFcfa(montantTotal) })] }), _jsx("td", { style: encaissementDividerColStyle, children: _jsx("div", { style: encaissementVerticalDividerStyle }) }), _jsx("td", { style: encaissementColRightStyle, children: commande.notes ? (_jsxs("div", { style: encaissementNotesStyle, children: [_jsx("strong", { children: "Notes :" }), " ", commande.notes] })) : null })] }) }) }) }), _jsxs(Section, { style: footerCurveBannerStyle, children: [_jsx(Text, { style: footerBrandStyle, children: "Milna Gourmet" }), _jsx(Text, { style: footerSubtitleStyle, children: "Le Salon du Yaourt" }), _jsx(Text, { style: footerNoticeStyle, children: "Cet email vous est envoy\u00E9 automatiquement par Milna Gourmet." }), _jsx(Text, { style: footerNoticeSubStyle, children: "Merci de ne pas y r\u00E9pondre." })] })] }) })] }));
};
// ============================================================================
// Styles en ligne (compatibilité maximale avec les clients email)
// ============================================================================
const mainBodyStyle = {
    backgroundColor: '#FFFFFF',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    margin: 0,
    padding: '16px 0 32px',
    color: '#2D3748',
};
const containerStyle = {
    maxWidth: '560px',
    margin: '0 auto',
    padding: '0 12px',
    backgroundColor: '#FFFFFF',
};
const logoSectionStyle = {
    textAlign: 'center',
    padding: '12px 0 24px',
};
const logoImgStyle = {
    margin: '0 auto',
    display: 'block',
    borderRadius: '50%',
};
const introSectionStyle = {
    marginBottom: '20px',
};
const introTextStyle = {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#2D3748',
    margin: '0 0 6px 0',
};
const introSubtextStyle = {
    fontSize: '14px',
    lineHeight: '1.5',
    color: '#2D3748',
    margin: '0',
};
// Carte Produits
const cardProduitsStyle = {
    borderRadius: '8px',
    border: '1px solid #D5E7E9',
    overflow: 'hidden',
    marginBottom: '22px',
    backgroundColor: '#FFFFFF',
};
const produitsHeaderStyle = {
    backgroundColor: '#1A848C',
    padding: '10px 16px',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
};
const produitRowStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #EDF4F5',
};
const produitNomColStyle = {
    fontSize: '13px',
    color: '#2D3748',
    textAlign: 'left',
    lineHeight: '1.4',
};
const produitPrixColStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A202C',
    textAlign: 'right',
    whiteSpace: 'nowrap',
    paddingLeft: '12px',
};
const ingredientDetailStyle = {
    fontSize: '11px',
    color: '#718096',
    marginTop: '3px',
};
const sousTotalRowStyle = {
    backgroundColor: '#E8F7F8',
    padding: '11px 16px',
    borderBottom: '1px solid #E2F2F4',
};
const sousTotalLabelStyle = {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'left',
};
const sousTotalValeurStyle = {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1A202C',
    textAlign: 'right',
    whiteSpace: 'nowrap',
};
const livraisonRowStyle = {
    backgroundColor: '#FFFFFF',
    padding: '11px 16px',
    borderBottom: '1px solid #EDF4F5',
};
const livraisonLabelStyle = {
    fontSize: '13px',
    color: '#4A5568',
    textAlign: 'left',
};
const livraisonValeurStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A202C',
    textAlign: 'right',
    whiteSpace: 'nowrap',
};
const totalRowStyle = {
    backgroundColor: '#DCF4F5',
    padding: '13px 16px',
};
const totalLabelStyle = {
    fontSize: '14px',
    fontWeight: '700',
    color: '#146E75',
    textAlign: 'left',
};
const totalValeurStyle = {
    fontSize: '18px',
    fontWeight: '800',
    color: '#146E75',
    textAlign: 'right',
    whiteSpace: 'nowrap',
};
const reglementFooterStyle = {
    backgroundColor: '#FFFFFF',
    padding: '10px 16px',
    fontSize: '12px',
    color: '#718096',
    borderTop: '1px solid #EDF4F5',
};
// Carte Informations Client
const cardClientStyle = {
    backgroundColor: '#EDF9FA',
    borderRadius: '8px',
    border: '1px solid #D5EBEF',
    padding: '16px 20px',
    marginBottom: '22px',
};
const clientCardTitleStyle = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1A848C',
    letterSpacing: '0.6px',
    textTransform: 'uppercase',
    margin: '0 0 16px 0',
};
const clientFieldLabelStyle = {
    fontSize: '10px',
    fontWeight: '700',
    color: '#718096',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    margin: '0 0 4px 0',
};
const clientFieldValueStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A202C',
    margin: '0 0 14px 0',
};
const clientFieldValueStyleNoMargin = {
    fontSize: '13px',
    color: '#1A202C',
    margin: '0',
};
const clientDividerStyle = {
    borderBottom: '1px solid #D5EBEF',
    margin: '0 0 14px 0',
};
const whatsappLinkStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#1A848C',
    textDecoration: 'none',
    display: 'inline-block',
};
// Carte À Encaisser
const cardEncaissementStyle = {
    backgroundColor: '#EDF9FA',
    borderRadius: '8px',
    border: '1px solid #D5EBEF',
    padding: '16px 20px',
    marginBottom: '26px',
};
const encaissementColLeftStyle = {
    verticalAlign: 'middle',
    textAlign: 'left',
};
const encaissementLabelStyle = {
    fontSize: '11px',
    fontWeight: '700',
    color: '#1A848C',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    marginBottom: '4px',
};
const encaissementMontantStyle = {
    fontSize: '22px',
    fontWeight: '800',
    color: '#146E75',
};
const encaissementDividerColStyle = {
    width: '30px',
    textAlign: 'center',
    verticalAlign: 'middle',
};
const encaissementVerticalDividerStyle = {
    width: '1px',
    height: '36px',
    backgroundColor: '#BCE3E8',
    margin: '0 auto',
};
const encaissementColRightStyle = {
    verticalAlign: 'middle',
    textAlign: 'left',
    paddingLeft: '12px',
};
const encaissementNotesStyle = {
    fontSize: '12px',
    color: '#4A5568',
    lineHeight: '1.4',
};
// Pied de page courbé
const footerCurveBannerStyle = {
    backgroundColor: '#1A848C',
    borderTopLeftRadius: '16px',
    borderTopRightRadius: '16px',
    padding: '24px 20px 20px',
    textAlign: 'center',
};
const footerBrandStyle = {
    fontSize: '15px',
    fontWeight: '700',
    color: '#FFFFFF',
    margin: '0 0 2px 0',
};
const footerSubtitleStyle = {
    fontSize: '12px',
    color: '#E8F7F8',
    margin: '0 0 12px 0',
};
const footerNoticeStyle = {
    fontSize: '11px',
    color: '#C7EBEF',
    margin: '0 0 2px 0',
};
const footerNoticeSubStyle = {
    fontSize: '11px',
    color: '#C7EBEF',
    margin: 0,
};
export default NewOrderEmail;
//# sourceMappingURL=NewOrderEmail.js.map