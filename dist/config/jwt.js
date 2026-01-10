import jwt from "jsonwebtoken";
import { env } from "./env.js";
const getAccessTokenSecret = () => {
    return env.ACCESS_TOKEN_SECRET;
};
const getRefreshTokenSecret = () => {
    return env.REFRESH_TOKEN_SECRET;
};
const ACCESS_TOKEN_EXPIRY = env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = env.REFRESH_TOKEN_EXPIRY;
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