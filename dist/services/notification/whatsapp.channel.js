import { env } from '../../config/env.js';
import { logger } from '../../config/logger.js';
/**
 * Canal WhatsApp, adossé à Telnyx (endpoint /v2/messages).
 *
 * Telnyx route un message vers le canal WhatsApp lorsque l'expéditeur
 * (`from`) est un numéro WhatsApp Business activé sur le compte.
 *
 * ⚠️ Fenêtre des 24 h : hors d'une conversation ouverte depuis moins de
 * 24 h, WhatsApp impose un « template » pré-approuvé plutôt qu'un texte
 * libre. Ces templates se configurent dans le portail Telnyx. Tant
 * qu'aucun n'est approuvé, ce canal reste volontairement non configuré et
 * l'orchestrateur bascule sur l'email.
 */
class WhatsAppChannel {
    nom = 'whatsapp';
    /**
     * Le canal n'est déclaré prêt que si la clé API ET l'expéditeur sont
     * présents. Un canal à moitié configuré serait pire que pas de canal du
     * tout : il capterait les envois pour échouer systématiquement.
     */
    estConfigure() {
        return Boolean(env.TELNYX_API_KEY && env.TELNYX_WHATSAPP_FROM);
    }
    resoudreDestinataire(destinataires) {
        const telephone = destinataires.telephone?.trim();
        return telephone ? telephone : null;
    }
    async envoyer(destinataire, contenu) {
        const payload = {
            from: env.TELNYX_WHATSAPP_FROM,
            to: destinataire,
            text: contenu.texte,
        };
        // Facultatif : rattache l'envoi à un Messaging Profile Telnyx précis.
        if (env.TELNYX_MESSAGING_PROFILE_ID) {
            payload.messaging_profile_id = env.TELNYX_MESSAGING_PROFILE_ID;
        }
        // Facultatif : force le type de message. Laisser vide pour le routage
        // par défaut du profil de messagerie.
        if (env.TELNYX_MESSAGE_TYPE) {
            payload.type = env.TELNYX_MESSAGE_TYPE;
        }
        const reponse = await fetch(`${env.TELNYX_BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${env.TELNYX_API_KEY}`,
            },
            body: JSON.stringify(payload),
        });
        if (!reponse.ok) {
            const corps = await reponse.text();
            throw new Error(`Échec de l'appel API Telnyx (${reponse.status}) : ${corps}`);
        }
        logger.debug({ canal: this.nom, destinataire }, 'Message WhatsApp envoyé');
    }
}
export const whatsappChannel = new WhatsAppChannel();
//# sourceMappingURL=whatsapp.channel.js.map