export class AppError extends Error{

    constructor(message: string,public readonly statusCode:number,public readonly isOperational:boolean=true, public readonly details?:any){
        super(message);
        Error.captureStackTrace(this);
    }
}

export class NotFoundError extends AppError{
    constructor(message = "Resource not found!"){
        super(message,404);
    }
}

export class ValidationError extends AppError{
    constructor(message="Invalid request data!",details?:any){
        super(message,400,true,details);
    }
}

export class AuthError extends AppError{
    constructor(message="Unuthorizes"){
        super(message,401);
    }
}

export class ForbiddenError extends AppError{
    constructor(message="Forbidden Access"){
        super(message,403);
    }
}

export class DatabaseError extends AppError{
    constructor(mesasge="Database error",details:any){
        super(mesasge,500,true,details);
    }
}

export class RateLimitError extends AppError{
    constructor(message="Too many request, Please try again later!"){
        super(message,429)
    }
}