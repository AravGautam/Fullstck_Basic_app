const express = require("express");
const cors = require("cors");
const postRoutes = require("./routes/post.routes")

const app = express();
app.use(cors())
app.use(express.json())


const requestStore = {};

function rateLimiter(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    const windowTime = 30 * 1000; // 1/2 minute
    console.log(req.method, req.url, req.path);
    console.log("Rate limiter called for IP:", ip);
    console.log("Current request timestamps for IP:", requestStore[ip], requestStore);

    if (!requestStore[ip]) {
        requestStore[ip] = [];
    }

    requestStore[ip] = requestStore[ip].filter(
        timestamp => now - timestamp < windowTime
    );

    requestStore[ip].push(now);

    console.log(requestStore[ip]);

    if (requestStore[ip].length > 10) {
        return res.status(429).json({
            error: "Too many requests"
        });
    }

    next();
}

function cleanupRequestStore() {
    const now = Date.now();
    const windowTime = 30 * 1000; // 1/2 minute

    for (const ip in requestStore) {
        requestStore[ip] = requestStore[ip].filter(
            timestamp => now - timestamp < windowTime
        );
        if (requestStore[ip].length === 0) {
            delete requestStore[ip];
        }
    }
}

// Call cleanupRequestStore every minute
setInterval(cleanupRequestStore, 60 * 1000);

const throttleStore = {};

function throttleMiddleware(req, res, next) {

    const ip = req.ip;
    const now = Date.now();
    const delay = 5 * 1000

    if (!throttleStore[ip]) {
        throttleStore[ip] = 0;
    }

    const timePassed = now - throttleStore[ip];

    if (timePassed < delay) {
        return res.status(429).json({
            error: `Wait ${Math.ceil((delay - timePassed)/1000)} seconds`
        });
    }

    throttleStore[ip] = now;
    next();
}

app.use("/api/", throttleMiddleware, rateLimiter, postRoutes)

module.exports = app