import Joi from "joi";
import UserType from "../common/enums/userType.enum";
import {Request,Response,NextFunction} from "express";
import { ValidationError } from "../../../../packages/middlewares/error-handler";

const passwordPattern = new RegExp('^[a-zA-Z0-9]{8,30}$');

const phoneNumberPattern = new RegExp("/^[0-9+\-\s()]{8,20}$/");

const userTypeSchema = Joi.object({
    userType : Joi.string().valid(UserType).required()
})

const registerUserSchema = Joi.object({
    name: Joi.string().alphanum().min(3).max(255).required(),
    email : Joi.string().email().required(),
    password: Joi.string().pattern(passwordPattern),
    confirmPassword: Joi.ref('password')
});

const registerSellerSchema = Joi.object({
    ...registerUserSchema,
    phone_number : Joi.string().pattern(phoneNumberPattern).required(),
    country : Joi.string().required()
});

export const registerValidation = (req:Request,res:Response,next:NextFunction)=>{
    try{
        const { error } = userTypeSchema.validate(req.body, { abortEarly: false });
        if (error) next(new ValidationError("Validation failed! userType field is required!"))
        
        const {userType} = req.body;

        if(userType===UserType.User){
            const { error } = registerUserSchema.validate(req.body, { abortEarly: false });
            if (error) next(new ValidationError("Validation failed! Some required fields are missing!"))
        }

        if(userType===UserType.Seller){
            const { error } = registerSellerSchema.validate(req.body, { abortEarly: false });
            if (error) next(new ValidationError("Validation failed! Some required fields are missing!"))
        }
        next()
    }catch(err){
        next(err)
    }
}