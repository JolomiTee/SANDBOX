import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectMgDb } from "./config/connectDB";
import mongoose from "mongoose";
import { corsOptions } from "./config/cors/corsOptions";
import { reqLogger } from "./middleware/logging/logLocalEvents";

const server = express();
const PORT = process.env.PORT || 3000;

dotenv.config();

//* Connect to MongoDB
connectMgDb();

//* custom middleware logger
server.use(reqLogger);

//* Handle options credentials check - before CORS!
// and fetch cookies credentials requirement

//* Cross Origin Resource Sharing
server.use(cors(corsOptions));

//* built-in middleware to handle urlencoded form data
server.use(express.urlencoded({ extended: false }));

//* built-in middleware for json
server.use(express.json());

//* middleware for cookies
server.use(cookieParser());

server.use("/", (req: Request, res: Response) => {
	res.send("Dev Mode");
});

mongoose.connection.once("open", () => {
	server.listen(PORT, () => {
		console.log(`I love you ${PORT}`);
	});
});
