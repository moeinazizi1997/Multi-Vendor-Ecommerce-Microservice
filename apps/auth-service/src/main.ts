import { error } from "console";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "../../../packages/middlewares/error-handler/error-handler";
import express from 'express';
import config from "../../../packages/config";
import router from "./routes/auth.routes";

const app = express();

app.use(cors({
  origin : ["http://localhost:3000"],
  allowedHeaders : ["Authorization","Content-Type"],
  credentials : true
}));

app.use(express.json({limit:"100mb"}));

app.use(express.urlencoded({limit:"100mb",extended:true}));

app.use(cookieParser());

app.get('/', (req, res) => {
    res.send({ 'message': 'Hello API'});
});

app.use("/api",router);

app.use(errorMiddleware);

const port = config.AUTH_SERVICE_PORT;

const server = app.listen(port, () => {
    console.log(`Auth servic is running at http://localhost:${port}`);
});

server.on("error",()=>{
    console.log("Server Error:",error)
});