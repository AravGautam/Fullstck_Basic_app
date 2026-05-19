const ImageKit = require("@imagekit/nodejs");

// MONGO_URI=mongodb+srv://aravgautam:aravgautam@backend-yt.llvlghj.mongodb.net/Project-1
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
});

async function uploadFile(buffer) {
    console.log(buffer)
    const result = await imagekit.files.upload({
        file: buffer.toString("base64"),
        fileName: `image_${Date.now()}.jpg`,
    });
    return result;
}

module.exports = uploadFile;