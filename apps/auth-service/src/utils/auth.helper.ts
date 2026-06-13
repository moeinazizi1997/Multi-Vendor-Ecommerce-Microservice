import {NextFunction} from "express";
import crypto from "crypto";
import redis from "../../../../packages/config/db/redis";
import { sendMail } from "./sendMail.ts";
import { ValidationError } from "../../../../packages/middlewares/error-handler";
export const checkOTPRestrictions = async(email:string,next:NextFunction)=>{

    if(await redis.get(`otp_lock:${email}`)){
        return next(new ValidationError("Account locked due to multiple otp failed attemps"));
    }
    if(await redis.get(`otp_spam_lock:${email}`)){
        return next(new ValidationError("Too many OTP requests. Please wait 1 hour before sending another request"));
    }

    if(await redis.get(`otp_cooldown:${email}`)){
        return next(new ValidationError("please wait 1minute before sending a new OTP request!"))
    }
}

export const trackOTPRequests = async(email:string,next:NextFunction)=>{
    const otpRequestKey = `otp_request-count:${email}`;
    let otpRequests = parseInt(await redis.get(otpRequestKey) || "0"); 

    if(otpRequests >=2){
        await redis.set(`otp_spam_lock:${email}`,"locked","EX",3600);
        return next(new ValidationError("Too many OTP Requests. Please wait 1hour before requesting again!"))
    }

    await redis.set(otpRequestKey,otpRequests+1,"EX",3600);
}

export const sendOTP = async (name:string,email:string,template:string)=>{
    const otp = crypto.randomInt(1000,9999).toString();
    await sendMail(email,"Verify Your Email",template,{name,otp});
    await redis.set(`otp:${email}`,otp,"EX",300);

    // if otp_cooldown is true that means you can not request for another otp
    await redis.set(`otp_cooldown:${email}`,"true","EX",60);
}