export interface AccessTokenPayload {
    userId: string;
    telephone: string;
    nomComplet: string;
    zoneLivraisonId: string | null;
    role: string;
}
export interface RefreshTokenPayload {
    userId: string;
    tokenVersion: number;
}
export declare const generateAccessToken: (payload: AccessTokenPayload) => string;
export declare const generateRefreshToken: (payload: RefreshTokenPayload) => string;
export declare const verifyAccessToken: (token: string) => AccessTokenPayload;
export declare const verifyRefreshToken: (token: string) => RefreshTokenPayload;
export declare const generateToken: (payload: AccessTokenPayload) => string;
export declare const verifyToken: (token: string) => AccessTokenPayload;
//# sourceMappingURL=jwt.d.ts.map