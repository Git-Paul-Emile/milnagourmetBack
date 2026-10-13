import React from 'react';
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
} from '@react-email/components';
import type { CommandeWithRelations } from '../../../repository/order.repository.js';

/**
 * Formate un montant entier en FCFA avec séparateur de milliers (ex: 4 500 FCFA).
 */
export function formaterMontantFcfa(montant: number): string {
  const formate = Math.round(montant)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return `${formate} FCFA`;
}

/**
 * Calcule le sous-total de la commande (somme des éléments et créations).
 */
export function calculerSousTotal(commande: CommandeWithRelations): number {
  const totalElements = (commande.elements ?? []).reduce(
    (acc, el) => acc + (el.prix || 0) * (el.quantite || 1),
    0
  );

  const totalCreations = (commande.creationsPersonnalisees ?? []).reduce(
    (acc, cr) => acc + (cr.prix || 0) * (cr.quantite || 1),
    0
  );

  const total = totalElements + totalCreations;
  if (total > 0) return total;

  return Math.max(0, (commande.montantTotal || 0) - (commande.fraisLivraison || 0));
}

/**
 * Retire l'indicatif +241, 00241 ou 241 du numéro de téléphone pour le lien WhatsApp.
 */
export function retirerIndicatif241(telephone: string): string {
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

interface NewOrderEmailProps {
  commande: CommandeWithRelations;
  logoUrl?: string;
}

export const NewOrderEmail: React.FC<NewOrderEmailProps> = ({
  commande,
  logoUrl = 'https://milnagourmet.com/images/logo.png',
}) => {
  const sousTotal = calculerSousTotal(commande);
  const fraisLivraison = commande.fraisLivraison ?? 0;
  const montantTotal = commande.montantTotal ?? 0;
  const whatsappLien = `https://wa.me/${retirerIndicatif241(commande.telephoneClient)}`;

  return (
    <Html lang="fr">
      <Head />
      <Preview>{`Nouvelle commande ${commande.numeroCommande} - ${commande.nomClient}`}</Preview>
      <Body style={mainBodyStyle}>
        <Container style={containerStyle}>
          {/* Logo Milna Gourmet en haut centré */}
          <Section style={logoSectionStyle}>
            <Img
              src={logoUrl}
              width="94"
              height="94"
              alt="Milna Gourmet"
              style={logoImgStyle}
            />
          </Section>

          {/* Message d'introduction */}
          <Section style={introSectionStyle}>
            <Text style={introTextStyle}>
              Une nouvelle commande vient d&apos;être enregistrée sur Milna Gourmet.
            </Text>
            <Text style={introSubtextStyle}>Voici le récapitulatif :</Text>
          </Section>

          {/* Carte 1 : PRODUITS */}
          <Section style={cardProduitsStyle}>
            {/* Entête du tableau Produits */}
            <div style={produitsHeaderStyle}>PRODUITS</div>

            {/* Liste des produits normaux */}
            {commande.elements &&
              commande.elements.map((element, index) => {
                const totalItem = (element.prix || 0) * (element.quantite || 1);
                const nomProduit = element.produit?.nom || 'Produit';
                return (
                  <div key={element.id ?? `elem-${index}`} style={produitRowStyle}>
                    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={produitNomColStyle}>
                            {`${nomProduit} x${element.quantite} (${formaterMontantFcfa(element.prix)})`}
                          </td>
                          <td style={produitPrixColStyle}>
                            {formaterMontantFcfa(totalItem)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}

            {/* Liste des créations personnalisées */}
            {commande.creationsPersonnalisees &&
              commande.creationsPersonnalisees.map((creation, index) => {
                const totalItem = (creation.prix || 0) * (creation.quantite || 1);
                const nomTaille = creation.taille?.nom || 'Création';
                const fruits = creation.fruits?.map((f) => f.fruit?.nom).filter(Boolean) || [];
                const sauces = creation.sauces?.map((s) => s.sauce?.nom).filter(Boolean) || [];
                const cereales = creation.cereales?.map((c) => c.cereale?.nom).filter(Boolean) || [];
                const detailsIngr = [...fruits, ...sauces, ...cereales].join(', ');

                return (
                  <div key={creation.id ?? `creat-${index}`} style={produitRowStyle}>
                    <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={produitNomColStyle}>
                            <div>{`Création personnalisée ${nomTaille} x${creation.quantite} (${formaterMontantFcfa(creation.prix)})`}</div>
                            {detailsIngr ? (
                              <div style={ingredientDetailStyle}>{detailsIngr}</div>
                            ) : null}
                          </td>
                          <td style={produitPrixColStyle}>
                            {formaterMontantFcfa(totalItem)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })}

            {/* Sous-total */}
            <div style={sousTotalRowStyle}>
              <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={sousTotalLabelStyle}>Sous-total</td>
                    <td style={sousTotalValeurStyle}>
                      {formaterMontantFcfa(sousTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Frais de livraison */}
            <div style={livraisonRowStyle}>
              <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={livraisonLabelStyle}>Frais de livraison</td>
                    <td style={livraisonValeurStyle}>
                      {formaterMontantFcfa(fraisLivraison)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Montant total */}
            <div style={totalRowStyle}>
              <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
                <tbody>
                  <tr>
                    <td style={totalLabelStyle}>Montant total</td>
                    <td style={totalValeurStyle}>
                      {formaterMontantFcfa(montantTotal)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Note de règlement */}
            <div style={reglementFooterStyle}>
              Règlement : paiement à la livraison
            </div>
          </Section>

          {/* Carte 2 : INFORMATIONS CLIENT */}
          <Section style={cardClientStyle}>
            <Text style={clientCardTitleStyle}>INFORMATIONS CLIENT</Text>

            {/* Client */}
            <Text style={clientFieldLabelStyle}>CLIENT</Text>
            <Text style={clientFieldValueStyle}>{commande.nomClient}</Text>

            <div style={clientDividerStyle} />

            {/* Téléphone WhatsApp */}
            <Text style={clientFieldLabelStyle}>TÉLÉPHONE</Text>
            <div style={{ margin: '0 0 14px 0' }}>
              <Link href={whatsappLien} style={whatsappLinkStyle}>
                {commande.telephoneClient}
              </Link>
            </div>

            <div style={clientDividerStyle} />

            {/* Mode de règlement */}
            <Text style={clientFieldLabelStyle}>MODE DE RÈGLEMENT</Text>
            <Text style={clientFieldValueStyleNoMargin}>Paiement à la livraison</Text>
          </Section>

          {/* Carte 3 : À ENCAISSER À LA LIVRAISON */}
          <Section style={cardEncaissementStyle}>
            <table role="presentation" width="100%" cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={encaissementColLeftStyle}>
                    <div style={encaissementLabelStyle}>
                      À ENCAISSER À LA LIVRAISON
                    </div>
                    <div style={encaissementMontantStyle}>
                      {formaterMontantFcfa(montantTotal)}
                    </div>
                  </td>
                  <td style={encaissementDividerColStyle}>
                    <div style={encaissementVerticalDividerStyle} />
                  </td>
                  <td style={encaissementColRightStyle}>
                    {commande.notes ? (
                      <div style={encaissementNotesStyle}>
                        <strong>Notes :</strong> {commande.notes}
                      </div>
                    ) : null}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Pied de page courbé Milna Gourmet */}
          <Section style={footerCurveBannerStyle}>
            <Text style={footerBrandStyle}>Milna Gourmet</Text>
            <Text style={footerSubtitleStyle}>Le Salon du Yaourt</Text>
            <Text style={footerNoticeStyle}>
              Cet email vous est envoyé automatiquement par Milna Gourmet.
            </Text>
            <Text style={footerNoticeSubStyle}>Merci de ne pas y répondre.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// ============================================================================
// Styles en ligne (compatibilité maximale avec les clients email)
// ============================================================================

const mainBodyStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  margin: 0,
  padding: '16px 0 32px',
  color: '#2D3748',
};

const containerStyle: React.CSSProperties = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '0 12px',
  backgroundColor: '#FFFFFF',
};

const logoSectionStyle: React.CSSProperties = {
  textAlign: 'center',
  padding: '12px 0 24px',
};

const logoImgStyle: React.CSSProperties = {
  margin: '0 auto',
  display: 'block',
  borderRadius: '50%',
};

const introSectionStyle: React.CSSProperties = {
  marginBottom: '20px',
};

const introTextStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#2D3748',
  margin: '0 0 6px 0',
};

const introSubtextStyle: React.CSSProperties = {
  fontSize: '14px',
  lineHeight: '1.5',
  color: '#2D3748',
  margin: '0',
};

// Carte Produits
const cardProduitsStyle: React.CSSProperties = {
  borderRadius: '8px',
  border: '1px solid #D5E7E9',
  overflow: 'hidden',
  marginBottom: '22px',
  backgroundColor: '#FFFFFF',
};

const produitsHeaderStyle: React.CSSProperties = {
  backgroundColor: '#1A848C',
  padding: '10px 16px',
  color: '#FFFFFF',
  fontSize: '12px',
  fontWeight: '700',
  letterSpacing: '0.6px',
  textTransform: 'uppercase',
};

const produitRowStyle: React.CSSProperties = {
  padding: '12px 16px',
  borderBottom: '1px solid #EDF4F5',
};

const produitNomColStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#2D3748',
  textAlign: 'left',
  lineHeight: '1.4',
};

const produitPrixColStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#1A202C',
  textAlign: 'right',
  whiteSpace: 'nowrap',
  paddingLeft: '12px',
};

const ingredientDetailStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#718096',
  marginTop: '3px',
};

const sousTotalRowStyle: React.CSSProperties = {
  backgroundColor: '#E8F7F8',
  padding: '11px 16px',
  borderBottom: '1px solid #E2F2F4',
};

const sousTotalLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '700',
  color: '#1A202C',
  textAlign: 'left',
};

const sousTotalValeurStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '700',
  color: '#1A202C',
  textAlign: 'right',
  whiteSpace: 'nowrap',
};

const livraisonRowStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '11px 16px',
  borderBottom: '1px solid #EDF4F5',
};

const livraisonLabelStyle: React.CSSProperties = {
  fontSize: '13px',
  color: '#4A5568',
  textAlign: 'left',
};

const livraisonValeurStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#1A202C',
  textAlign: 'right',
  whiteSpace: 'nowrap',
};

const totalRowStyle: React.CSSProperties = {
  backgroundColor: '#DCF4F5',
  padding: '13px 16px',
};

const totalLabelStyle: React.CSSProperties = {
  fontSize: '14px',
  fontWeight: '700',
  color: '#146E75',
  textAlign: 'left',
};

const totalValeurStyle: React.CSSProperties = {
  fontSize: '18px',
  fontWeight: '800',
  color: '#146E75',
  textAlign: 'right',
  whiteSpace: 'nowrap',
};

const reglementFooterStyle: React.CSSProperties = {
  backgroundColor: '#FFFFFF',
  padding: '10px 16px',
  fontSize: '12px',
  color: '#718096',
  borderTop: '1px solid #EDF4F5',
};

// Carte Informations Client
const cardClientStyle: React.CSSProperties = {
  backgroundColor: '#EDF9FA',
  borderRadius: '8px',
  border: '1px solid #D5EBEF',
  padding: '16px 20px',
  marginBottom: '22px',
};

const clientCardTitleStyle: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: '700',
  color: '#1A848C',
  letterSpacing: '0.6px',
  textTransform: 'uppercase',
  margin: '0 0 16px 0',
};

const clientFieldLabelStyle: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: '700',
  color: '#718096',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  margin: '0 0 4px 0',
};

const clientFieldValueStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#1A202C',
  margin: '0 0 14px 0',
};

const clientFieldValueStyleNoMargin: React.CSSProperties = {
  fontSize: '13px',
  color: '#1A202C',
  margin: '0',
};

const clientDividerStyle: React.CSSProperties = {
  borderBottom: '1px solid #D5EBEF',
  margin: '0 0 14px 0',
};

const whatsappLinkStyle: React.CSSProperties = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#1A848C',
  textDecoration: 'none',
  display: 'inline-block',
};

// Carte À Encaisser
const cardEncaissementStyle: React.CSSProperties = {
  backgroundColor: '#EDF9FA',
  borderRadius: '8px',
  border: '1px solid #D5EBEF',
  padding: '16px 20px',
  marginBottom: '26px',
};

const encaissementColLeftStyle: React.CSSProperties = {
  verticalAlign: 'middle',
  textAlign: 'left',
};

const encaissementLabelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: '700',
  color: '#1A848C',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  marginBottom: '4px',
};

const encaissementMontantStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: '800',
  color: '#146E75',
};

const encaissementDividerColStyle: React.CSSProperties = {
  width: '30px',
  textAlign: 'center',
  verticalAlign: 'middle',
};

const encaissementVerticalDividerStyle: React.CSSProperties = {
  width: '1px',
  height: '36px',
  backgroundColor: '#BCE3E8',
  margin: '0 auto',
};

const encaissementColRightStyle: React.CSSProperties = {
  verticalAlign: 'middle',
  textAlign: 'left',
  paddingLeft: '12px',
};

const encaissementNotesStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#4A5568',
  lineHeight: '1.4',
};

// Pied de page courbé
const footerCurveBannerStyle: React.CSSProperties = {
  backgroundColor: '#1A848C',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  padding: '24px 20px 20px',
  textAlign: 'center',
};

const footerBrandStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: '700',
  color: '#FFFFFF',
  margin: '0 0 2px 0',
};

const footerSubtitleStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#E8F7F8',
  margin: '0 0 12px 0',
};

const footerNoticeStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#C7EBEF',
  margin: '0 0 2px 0',
};

const footerNoticeSubStyle: React.CSSProperties = {
  fontSize: '11px',
  color: '#C7EBEF',
  margin: 0,
};

export default NewOrderEmail;
