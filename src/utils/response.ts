/**
 * Métadonnées de pagination renvoyées quand une liste est paginée
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Format standardisé pour les réponses JSON du serveur
 * @param status "success" | "error" | "not_found" | "fail" | "unauthorized"
 * @param message Message à afficher
 * @param data Données optionnelles
 * @param meta Métadonnées optionnelles (ex: pagination). Absent si la liste n'est pas paginée.
 */
export function jsonResponse<T = unknown>({
  status,
  message,
  data = null,
  meta
}: {
  status: "success" | "error" | "not_found" | "fail" | "unauthorized";
  message: string;
  data?: T | null;
  meta?: PaginationMeta;
}) {
  return meta
    ? { status, message, data, meta }
    : { status, message, data };
}

/** Calcule les métadonnées de pagination à partir du total, de la page et de la limite */
export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit))
  };
}