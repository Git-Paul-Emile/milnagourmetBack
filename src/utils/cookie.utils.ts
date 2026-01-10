import type { Response } from 'express';
import { env } from '../config/env.js';

interface CookieOptions {
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'none' | 'lax' | 'strict';
  maxAge: number;
}

export const setAuthCookie = (res: Response, token: string): void => {
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
  };

  res.cookie('refreshToken', token, cookieOptions);
};

export const clearAuthCookie = (res: Response): void => {
  res.clearCookie('refreshToken');
};
