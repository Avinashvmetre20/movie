const jwt = require("jsonwebtoken")
const userModel = require("../model/userModel")

exports.protect = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            // console.log(token)
            return res.status(401).json({ msg: "no token" })
        }
        let decoded = jwt.verify(token, process.env.SECREATE_KEY);
        let role = decoded.role
        // console.log(token, decoded)
        req.user = await userModel.findById(decoded.id);
        if(role == "admin"){
            next()
        }
        next()
    }
    catch (err) {
        res.status(500).json({ msg: "invalid token" })
    }
}
