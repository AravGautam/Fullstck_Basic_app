const express = require("express");
const cors = require("cors");
const postRoutes = require("./routes/post.routes");

const app = express();
app.use(cors())
app.use(express.json())

// ---------------- RATE LIMITER ----------------

const requestStore = {};

function rateLimiter(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    const windowTime = 60 * 1000; // 1 minute
    // console.log(req.method, req.url, req.path);
    // console.log("Rate limiter called for IP:", ip);
    // console.log("Current request timestamps for IP:", requestStore[ip], requestStore);

    if (!requestStore[ip]) {
        requestStore[ip] = [];
    }

    requestStore[ip] = requestStore[ip].filter(
        timestamp => now - timestamp < windowTime
    );

    requestStore[ip].push(now);
    console.log('Rate limmmtiing rn bitch stwwaapp')
    console.log("Requests:", requestStore[ip]);

    if (requestStore[ip].length > 5) {
        return res.status(429).json({
            error: "Too many requests"
        });
    }

    next();
}


// ---------------- THROTTLE ----------------

const throttleStore = {};

function throttleMiddleware(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    const delay = 5 * 1000; // 5 sec

    // first request
    if (!throttleStore[ip]) {
        throttleStore[ip] = now;
        return next();
    }
    
    console.log("Throttle middleware called for:", ip);
    console.log(throttleStore)

    const timePassed = now - throttleStore[ip];
    console.log(timePassed)
    // block if request too fast
    if (timePassed < delay) {
        console.log("Wait nigga..!!",`Please wait ${Math.ceil((delay - timePassed) / 1000)} seconds`)
        return res.status(429).json({
            error: `Please wait ${Math.ceil((delay - timePassed) / 1000)} seconds`
        });
    }

    // update latest request time
    throttleStore[ip] = now;
    next();
}


// ---------------- ROUTES ----------------

app.use("/api/", throttleMiddleware, rateLimiter, postRoutes);

module.exports = app;