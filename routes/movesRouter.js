const express = require("express");
const{allMovies,create,deleted}= require("../controllers/movieController")
const {protect} = require("../middlewares/userMiddle");

const movieRouter = express.Router();

movieRouter.get("/",allMovies);
movieRouter.post("/create",create);
movieRouter.delete("/:id",deleted);
module.exports = movieRouter;