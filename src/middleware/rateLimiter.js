import rateLimit from 'express-rate-limit';

export const loginLimiter = ({ windowTime = 15, maxLogins = 5 } = {}) => {
    return rateLimit({
        windowMs: windowTime * 60 * 1000,
        max: maxLogins,
        standardHeaders: true,
        legacyHeaders: false,
        message: {
            message: `Too many login attempts. Please try again after ${windowTime} minutes.`
        }
    })
}