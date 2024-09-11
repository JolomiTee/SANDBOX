import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectMgDb } from "./config/connectDB";

const server = express();
const PORT = process.env.PORT || 3000;

//* Connect to MongoDB
connectMgDb();

//! custom middleware logger

//! Handle options credentials check - before CORS!
// and fetch cookies credentials requirement

//! Cross Origin Resource Sharing
server.use(cors());

//! built-in middleware to handle urlencoded form data
server.use(express.urlencoded({ extended: false }));

// built-in middleware for json
server.use(express.json());

//! middleware for cookies
server.use(cookieParser());

server.use();

server.listen(PORT, () => {
	console.log(`I love you ${PORT}`);
});
