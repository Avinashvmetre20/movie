const userModel = require("../model/userModel");
const jwt = require("jsonwebtoken");

exports.login = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(400).json({success:false,msg:"invalid creadiatials"})
        }
                const token = jwt.sign({id:user._id,email:user.email},process.env.SECREATE_KEY,{expiresIn:"1h"})

        if(password === user.password){
            res.status(200).json({success:true,Token:token})
        }
        else{
            res.status(400).json({success:false,msg:"invalid creadiatioals"})           
        }
    }
    catch(err){
        res.status(500).json({msg:err.message});
    }
}

exports.signIn = async (req,res)=>{
    const {name, email,password} = req.body;

    try{
        const userExist = await userModel.findOne({email});
        if(userExist){
            return res.status(400).json({success:false,msg:"user already exist, please login"})
        }
        const user = await userModel.create({
            name,email,password
        }) 
        const token = jwt.sign({id:user._id,email:user.email},process.env.SECREATE_KEY,{expiresIn:"1h"})
        res.status(201).json({success:true,Token:token})
    }
    catch(err){
        res.status(500).json({ success: false, msg: err.message });

    }
}
