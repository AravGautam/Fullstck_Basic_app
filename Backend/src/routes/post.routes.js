const multer = require("multer");
const uploadFile = require("../services/storage.service");
const postModel = require("../models/post.model");
const cors = require("cors");
const express = require("express");
const router = express.Router();


const upload = multer({storage: multer.memoryStorage()})

router.post('/create-post', upload.single("image"), async(req, res) => {
    console.log(req.body)
    console.log(req.file)
    const result = await uploadFile(req.file.buffer)
    console.log(result)
    const post = await postModel.create({
        image: result.url,
        caption: req.body.caption
    })
    
    res.status(201).json({
        message: "Post created", post: post
    })
})

router.get("/posts", async(req, res) => {
    // const id = req.params.id
    const posts = await postModel.find()
    res.status(200).json({
        message: "Posts fetched",
        posts: posts
    })
})

router.get('/', (req, res) => {
    res.status(200).send("Server is alive.")
})

module.exports = router