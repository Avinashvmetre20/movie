const movieModel = require("../model/movieModel");

exports.create = async (req,res)=> {
    const {title,director,genre,releaseDate,duration,rating,description,posterUrl,createdAt}= req.body
    try{
        const movieExist = await movieModel.findOne({title});
        if(movieExist){
            return res.status(400).json({msg:"movie already present"})
        }
        const movie = await movieModel.create({
            title,
            director,
            genre,
            releaseDate,
            duration,
            rating,
            description,
            posterUrl,
            createdAt
        });
        res.status(201).json({Movie:movie});
    }
    catch(err){
        res.status(400).json({msg:"not able to create"})
    }
}

exports.allMovies = async (req,res)=>{
    try{
        const movies = await movieModel.find()
        res.status(200).json({Movies:movies})
    }
    catch(err){
        res.status(500).json({msg:"not able to get all"})
    }
}

exports.deleted = async (req,res)=>{
    const {id} = req.params
    try{
        console.log("id",id);
        const deletedMovie = await movieModel.findByIdAndDelete(id) 
        res.status(200).json({msg:deletedMovie})
    }
    catch(err){
        res.status(500).json({msg:"not able to delete"})
    }
}