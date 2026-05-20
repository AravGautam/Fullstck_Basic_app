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
    const windowTime = 30 * 1000; // 1 minute
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

app.use("/api/", rateLimiter, postRoutes)

module.exports = app