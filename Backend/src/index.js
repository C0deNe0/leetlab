import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
dotenv.config()

const app = express();
app.use(cookieParser())
app.use(express.json())

app.get("/",(req,res)=>{
    res.send("Hello there people")
})



app.use("/api/v1/auth",authRoutes)
app.use("/api/v1/problems",problemRoutes)




app.listen(process.env.PORT,()=>{
    console.log(`The port is running ${process.env.PORT}`)
})