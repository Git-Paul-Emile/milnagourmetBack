import { env } from '../config/env.js';
export const setAuthCookie = (res, token) => {
    const cookieOptions = {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    };
    res.cookie('refreshToken', token, cookieOptions);
};
export const clearAuthCookie = (res) => {
    res.clearCookie('refreshToken');
};
//# sourceMappingURL=cookie.utils.js.map