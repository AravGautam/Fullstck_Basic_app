const moongoose = require("mongoose");

const userSchema = new moongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: String,
})

const userModel = moongoose.model("user", userSchema);
module.exports = userModel;