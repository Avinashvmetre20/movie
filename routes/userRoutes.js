const express = require("express")
const {login,signIn} = require("../controllers/userCotroller")

const userRouter = express.Router();

userRouter.post("/login",login);
userRouter.post("/signin",signIn);

module.exports = userRouter