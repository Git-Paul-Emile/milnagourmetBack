import jwt from "jsonwebtoken";
const getAccessTokenSecret = () => {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        throw new Error("ACCESS_TOKEN_SECRET manquant dans .env");
    }
    return secret;
};
const getRefreshTokenSecret = () => {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    if (!secret) {
        throw new Error("REFRESH_TOKEN_SECRET manquant dans .env");
    }
    return secret;
};
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, getAccessTokenSecret(), {
        expiresIn: ACCESS_TOKEN_EXPIRY,
    });
};
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, getRefreshTokenSecret(), {
        expiresIn: REFRESH_TOKEN_EXPIRY,
    });
};
export const verifyAccessToken = (token) => {
    return jwt.verify(token, getAccessTokenSecret());
};
export const verifyRefreshToken = (token) => {
    return jwt.verify(token, getRefreshTokenSecret());
};
// Fonction de compatibilité pour l'ancien code
export const generateToken = generateAccessToken;
export const verifyToken = verifyAccessToken;
//# sourceMappingURL=jwt.js.map