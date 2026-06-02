const express = require("express");
const cors = require("cors");
const throttleMiddleware = require("./middleware/throttle");
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





// ---------------- ROUTES ----------------

app.use("/api/", throttleMiddleware(), rateLimiter, postRoutes);

module.exports = app;