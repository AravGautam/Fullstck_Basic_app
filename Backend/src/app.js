const express = require("express");
const cors = require("cors");
const postRoutes = require("./routes/post.routes")

const app = express();  
app.use(cors())
app.use(express.json())
app.use("/api/", postRoutes)

module.exports = app