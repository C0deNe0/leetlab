import express from "express"
import dotenv from "dotenv"

dotenv.config()
const app = express();

app.listen(process.env.PORT,()=>{
    console.log(`The port is running ${process.env.PORT}`)
})