import express from "express";
import {db} from "../libs/db.js";
import bcrypt from "bcryptjs"
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"


export const registerController = async (req,res)=>{
    const {email, password, name } = req.body;
    try {
        const existingUser = await db.user.findUnique({
            where : {
                email
            }
        })

    if(existingUser){
        return res.status(400).json({
            error: "user already exists"
        })
    }


    const hashedPassword = await bcrypt.hash(paswword, 10)
    const newUser = await db.user.create({
        date:{
            email,
            password:hashedPassword,
            name,
            role: UserRole.USER
        }
    })

 const token = jwt.sign({id:newUser.id},process.env.JWT_SECRET ,{expiresIn:"7d"})

    res.cookie("jwt",token, {
        httpOnly: true,
        sameSite: "strict",
        secure:process.env.NODE_ENV !== "development",
        maxAge:1000*60*60*24*7 //7  days

    })

    res.status(201).json({
        success: true,
        message:"user created successfully",
        user:{
            id:newUser.id,
            email:newUser.email,
            name:newUser.name,
            role:newUser.role,
            image: newUser.image
        }
    })

    } catch (error) {
        console.error("error creating a user",error);
        res.status(500),json({
            error: "error creating a user"
        })
    }
} 
export const loginController = async (req,res)=>{
    const {email,password} = req.body;

    try {
        const user = await db.user.findUnique({
            where:{
                email
            }
        })
    
    if(!user){
        return res.status(401).json({
            error: "user not found"
        })
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        return res.status(401).json({
            error:"invalid credentials" 
        })
    }

    const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    res.cookie("jwt",token, {
        httpOnly: true,
        sameSite: "strict",
        secure:process.env.NODE_ENV !== "development",
        maxAge:1000*60*60*24*7 //7  days

    })

    res.status(201).json({
        success: true,
        message:"user logged in successfully",
        user:{
            id:user.id,
            email:user.email,
            name:user.name,
            role:user.role,
            image: user.image
        }
    })


    } catch (error) {
        console.error("error creating a user",error);
        res.status(500),json({
            error: "error creating a user"
        })
    }


} 
export const logoutController = async (req,res)=>{
    try {
        res.clearCookie("jwt",{
            httpOnly: true,
            sameSite: "strict",
            secure:process.env.NODE_ENV !== "development",    

        })

        res.status(204).json({
            success: true,
            message:"logged out successfully"
        })
    } catch (error) {
        console.error("error creating a user",error);
        res.status(500),json({
            error: "error creating a user"
        })
    }
} 
export const checkController = async (req,res)=>{

    try {
        res.status(200).json({
            success:true,
            message:"user authenticated successfully",
            user:req.user
        })
    } catch (error) {
        console.error("error checking user:",error)
        res.status(500).json({
            error:"error checking user"
        })
    }
} 
