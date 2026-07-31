import { echapperHtml } from '../email.channel.js';

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
export function gabaritEmail(options: {
  titre: string;
  corpsHtml: string;
  piedDePage?: string;
}): string {
  const { titre, corpsHtml, piedDePage } = options;

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${echapperHtml(titre)}</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f6f5f2;font-family:Arial,Helvetica,sans-serif;color:#2b2b2b;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f6f5f2;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background-color:#7a3e1d;padding:20px 24px;">
                <span style="color:#ffffff;font-size:20px;font-weight:bold;letter-spacing:0.5px;">Milna Gourmet</span>
                <span style="color:#f0d9c4;font-size:13px;display:block;margin-top:2px;">Le Salon du Yaourt — Libreville</span>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                <h1 style="margin:0 0 16px;font-size:18px;color:#7a3e1d;">${echapperHtml(titre)}</h1>
                ${corpsHtml}
              </td>
            </tr>
            <tr>
              <td style="background-color:#faf7f4;padding:16px 24px;font-size:12px;color:#7a7a7a;">
                ${piedDePage ?? "Cet email vous est envoyé automatiquement par Milna Gourmet. Merci de ne pas y répondre."}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

/** Paragraphe stylé, prêt à insérer dans le gabarit. */
export function paragraphe(texte: string): string {
  return `<p style="margin:0 0 12px;font-size:14px;line-height:1.6;">${echapperHtml(texte)}</p>`;
}

/** Bloc préformaté pour le détail d'une commande (conserve les retours à la ligne). */
export function blocPreformate(texte: string): string {
  return `<pre style="margin:0 0 16px;padding:12px;background-color:#faf7f4;border-radius:8px;font-family:Consolas,Monaco,monospace;font-size:13px;line-height:1.5;white-space:pre-wrap;word-break:break-word;">${echapperHtml(texte)}</pre>`;
}

/** Bouton d'action principal (rendu en table pour Outlook). */
export function bouton(libelle: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:16px 0;">
  <tr>
    <td style="background-color:#7a3e1d;border-radius:8px;">
      <a href="${echapperHtml(url)}" style="display:inline-block;padding:12px 24px;color:#ffffff;font-size:14px;font-weight:bold;text-decoration:none;">${echapperHtml(libelle)}</a>
    </td>
  </tr>
</table>`;
}
