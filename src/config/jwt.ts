import jwt from "jsonwebtoken";
import { env } from "./env.js";

const getAccessTokenSecret = (): string => {
  return env.ACCESS_TOKEN_SECRET;
};

const getRefreshTokenSecret = (): string => {
  return env.REFRESH_TOKEN_SECRET;
};

const ACCESS_TOKEN_EXPIRY = env.ACCESS_TOKEN_EXPIRY;
const REFRESH_TOKEN_EXPIRY = env.REFRESH_TOKEN_EXPIRY;

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

export const generateAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, getAccessTokenSecret(), {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  } as jwt.SignOptions);
};

export const generateRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, getRefreshTokenSecret(), {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  } as jwt.SignOptions);
};

export const verifyAccessToken = (token: string): AccessTokenPayload => {
  return jwt.verify(token, getAccessTokenSecret()) as AccessTokenPayload;
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  return jwt.verify(token, getRefreshTokenSecret()) as RefreshTokenPayload;
};

// Fonction de compatibilité pour l'ancien code
export const generateToken = generateAccessToken;
export const verifyToken = verifyAccessToken;
