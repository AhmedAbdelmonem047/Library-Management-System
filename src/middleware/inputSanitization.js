function sanitize(obj) {
    if (typeof obj !== 'object' || obj === null) return;

    for (const key in obj) {
        if (key.startsWith('$') || key.includes('.'))
            delete obj[key];
        else
            sanitize(obj[key]);
    }
}

export const mongoSanitizeMiddleware = (req, res, next) => {
    sanitize(req.body);
    sanitize(req.query);
    sanitize(req.params);
    next();
}