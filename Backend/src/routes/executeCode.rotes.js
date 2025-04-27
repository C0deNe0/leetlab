import express from "express"
import {authMiddleware, checkAdmin} from "../middleware/auth.middleware.js"
const executeRoute = express.Router();

executeRoute.post("/",authMiddlware, executeCode)


export default executeRoute;