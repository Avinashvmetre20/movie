const mongoose = require("mongoose");

const modelSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
});

const userModel = mongoose.model("User",modelSchema);
module.exports = userModel;
