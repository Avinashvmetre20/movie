const express = require("express");
const dotenv = require("dotenv");
const path = require("path")
dotenv.config();
const cors = require("cors");


const connection = require("./config/db")
const userRouter = require("./routes/userRoutes")
const movieRouter = require("./routes/movesRouter")
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "frontend")));

app.use(express.json())

app.get("/",(req,res)=>{
    res.send("working")
})

app.use("/user",userRouter);
app.use("/movie",movieRouter)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "Frontend", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`running on ${PORT}`)
    connection()
})