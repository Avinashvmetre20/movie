const mongoose  = require("mongoose");



const conn = async()=>{
    try{
        const con = await mongoose.connect(process.env.MONGO_DB)
        console.log(`Mongoodb connected`)
    }
    catch(err){
        console.log(`errr in connecting ${err.messsage}`)
    }
    
}

module.exports = conn