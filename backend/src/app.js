const express=require("express");
const cors=require("cors");
const incidentRoutes=require("./routes/incidentRoutes")
const app=express();
//const connectDB=require("./config/dbConfig")
const {connectRedis}=require("./config/redisConfig")
const logger=require("./utils/logger")
app.use(cors());
app.use(express.json());
module.exports=app;
//connectDB();
connectRedis();

app.use("/api",incidentRoutes)
logger.info("Express server initialized and routes configured")
app.get("/",(req,res)=>{
    res.json({message:`Welcome to Urban Threat Intelligence API`})
})