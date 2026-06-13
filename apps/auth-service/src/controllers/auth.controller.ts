import {Request,Response,NextFunction} from "express";
import prisma from "../../../../packages/libs/prisma";
import { ValidationError } from "../../../../packages/middlewares/error-handler";
import {sendOTP, trackOTPRequests} from "../utils/auth.helper"
export const userRegistration = async (req:Request,res:Response, next:NextFunction) =>{
    try{
        const {name,email} = req.body;
        const exsitingUser = await prisma.user.findUnique({
            where : {
                email : email
            }
        });
        if(exsitingUser) next(new ValidationError("User already exists with this email!"));

        await trackOTPRequests(email,next);

        sendOTP(email,name,"user-ativation-mail");

        return res.status(200).json({
            message : "OTP has just sent. Please check your email and check your account"
        })
        
    }catch(err){
        return next(err)
    }
}