import Redis from "ioredis";
import config from "../../../packages/config";

const redis = new Redis({
    host : config.REDIS_HOST,
    port : parseInt(config.REDIS_PORT),
    password : config.REDIS_PASSWORD
});

export default redis;