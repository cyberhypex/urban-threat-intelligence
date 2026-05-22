const express=require("express");
const cors=require("cors");
const app=express();
const connectDB=require("./config/dbConfig")
app.use(cors());
app.use(express.json());
module.exports=app;
connectDB();

app.get("/",(req,res)=>{
    res.json({message:`Welcome to Urban Threat Intelligence API`})
})