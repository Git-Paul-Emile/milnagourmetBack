/**
 * Format standardisé pour les réponses JSON du serveur
 * @param status "success" | "error" | "not_found" | "fail" | "unauthorized"
 * @param message Message à afficher
 * @param data Données optionnelles
 */
export declare function jsonResponse({ status, message, data }: {
    status: "success" | "error" | "not_found" | "fail" | "unauthorized";
    message: string;
    data?: any;
}): {
    status: "error" | "success" | "not_found" | "fail" | "unauthorized";
    message: string;
    data: any;
};
//# sourceMappingURL=response.d.ts.map