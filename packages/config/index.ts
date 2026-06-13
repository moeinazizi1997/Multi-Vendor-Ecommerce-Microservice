import dotenv from "dotenv";
dotenv.config();

const getEnv = (envName:string,defaultValue?:string)=>{
    const ENV = process.env[envName]
    if (!ENV){
        if(defaultValue) return defaultValue;
        throw new Error(`Environmen variable ${envName} does not set`)
    }
    return ENV;
}

const config = {
    REDIS_HOST : getEnv("REDIS_HOST","127.0.0.1"),
    REDIS_PORT : getEnv("REDIS_PORT","6379"),
    REDIS_PASSWORD : getEnv("REDIS_PASSWORD"),
    AUTH_SERVICE_PORT : getEnv("AUTH_PORT","6001"),
    API_GATEWAY_PORT : getEnv("API_GATEWAY_PORT","8080"),
    EMAIL : {
        SMTP_HOST : getEnv("SMTP_HOST"),
        SMTP_PORT : getEnv("SMTP_PORT","587"),
        SMTP_SERVICE : getEnv("SMTP_SERVICE"),
        AUTH : {
            SMTP_AUTH_USER : getEnv("SMTP_AUTH_USER"),
            SMTP_AUTH_PASSWORD : getEnv("SMTP_AUTH_PASSWORD"),
        }
    }
}

export default config;