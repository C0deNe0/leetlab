import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware";
import{createProblemController,getAllProblemController,getProblemByIDController,updateProblemByIDController,deleteProblemByIDController,getAllSolvedProblemByUserController} from "../controllers/problem.controller.js"
const problemRoutes = express.Router;

problemRoutes.post("/create-problem",authMiddleware,checkAdmin,createProblemController)
problemRoutes.get("/get-all-problem",authMiddleware,getAllProblemController)
problemRoutes.get("/get-all-problem/:id",authMiddleware,getProblemByIDController)
problemRoutes.put("/update-problem/:id",authMiddleware,checkAdmin,updateProblemByIDController)

problemRoutes.delete("/delete-problem/:id",authMiddleware,checkAdmin,deleteProblemByIDController)
problemRoutes.get("/get-solved-problem/:id",authMiddleware,checkAdmin,getAllSolvedProblemByUserController)

export default problemRoutes;