import rateLimit from 'express-rate-limit';
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: { status: 'error', message: 'Trop de tentatives, réessayez dans 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false,
});
export const refreshLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: { status: 'error', message: 'Trop de requêtes, réessayez dans une minute.' },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimiter.js.map