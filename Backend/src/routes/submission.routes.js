import express from "express";
import {authMiddleware} from "../middleware/auth.middleware.js"


const submissionRoutes =express.Router();

submissionRoutes.get("/get-all-submission")