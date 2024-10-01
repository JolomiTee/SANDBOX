import dotenv from "dotenv";
import express from "express";
import path from "path";

import cookieParser from "cookie-parser";
import cors from "cors";

import { reqLogger } from "./middleware/logging/logLocalEvents";
import { errorHandler } from "./middleware/logging/errorHandler";

import mongoose from "mongoose";
import { connectMgDb } from "./config/connectDB";
import { corsOptions } from "./config/cors/corsOptions";

import userRouter from "./routes/user.routes";
import blogRouter from "./routes/blog.routes";

dotenv.config();

const server = express();
const PORT = process.env.PORT || 3000;

//* Connect to MongoDB
connectMgDb();

//* custom middleware event logger
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

//* routes
server.use("/", userRouter);
server.use("/blogs", blogRouter);

//! catchall route for invalid routes
server.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ error: "404 - Route Not Found" });
	} else {
		res.type("txt").send("404 - Route Not Found");
	}
});

//! error logging
server.use(errorHandler);

mongoose.connection.once("open", () => {
	server.listen(PORT, () => {
		console.log(`I love you ${PORT}`);
	});
});
