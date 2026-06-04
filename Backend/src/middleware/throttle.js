/**
 * Throttle Middleware - Limits the frequency of requests from a single IP
 * @param {number} delayMs - Delay in milliseconds between allowed requests (default: 5000ms)
 * @returns {Function} Express middleware function
 */
function throttleMiddleware(delayMs = 5000) {
    const throttleStore = {};

    return (req, res, next) => {
        const ip = req.ip;
        const now = Date.now();

        // First request from this IP - allow it
        if (!throttleStore[ip]) {
            throttleStore[ip] = now;
            return next();
        }

        const timePassed = now - throttleStore[ip];

        // If enough time has passed, allow the request
        if (timePassed >= delayMs) {
            throttleStore[ip] = now;
            return next();
        }

        // Request too fast - reject it
        const waitSeconds = Math.ceil((delayMs - timePassed) / 1000);
        // console.log(`IP ${ip} is making requests too quickly. Please wait ${waitSeconds} seconds.`);
        return res.status(429).json({
            error: `Too many requests. Please wait ${waitSeconds} seconds before trying again.`
        });
    };
}

module.exports = throttleMiddleware;
