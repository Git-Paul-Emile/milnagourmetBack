/**
 * Format standardisé pour les réponses JSON du serveur
 * @param status "success" | "error" | "not_found" | "fail" | "unauthorized"
 * @param message Message à afficher
 * @param data Données optionnelles
 * @param meta Métadonnées optionnelles (ex: pagination). Absent si la liste n'est pas paginée.
 */
export function jsonResponse({ status, message, data = null, meta }) {
    return meta
        ? { status, message, data, meta }
        : { status, message, data };
}
/** Calcule les métadonnées de pagination à partir du total, de la page et de la limite */
export function buildPaginationMeta(page, limit, total) {
    return {
        page,
        limit,
        total,
        totalPages: Math.max(1, Math.ceil(total / limit))
    };
}
//# sourceMappingURL=response.js.map