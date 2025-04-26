import express from "express"
import { registerController, loginController,logoutController,checkController } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";
const authRoutes = express.Router();

//routes

authRoutes.post("/register",registerController)
authRoutes.post("/login",loginController)
authRoutes.post("/logout",authMiddleware,logoutController)
authRoutes.get("/check",authMiddleware,checkController)




export default  authRoutes;