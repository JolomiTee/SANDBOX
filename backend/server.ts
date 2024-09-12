import dotenv from "dotenv";
import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";

import { reqLogger } from "./middleware/logging/logLocalEvents";
import { errorHandler } from "./middleware/logging/errorHandler";

import mongoose from "mongoose";
import { connectMgDb } from "./config/connectDB";
import { corsOptions } from "./config/cors/corsOptions";

import authRouter from "./routes/auth.routes";
import logoutRouter from "./routes/logout.routes";
import refreshRouter from "./routes/refresh.routes";
import registerRouter from "./routes/register.routes";
import rootRouter from "./routes/root.routes";

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
server.use("/", rootRouter);
server.use("/auth", authRouter);
server.use("refresh", refreshRouter);
server.use("/logout", logoutRouter);
server.use("/register", registerRouter);

//* error logging
server.use(errorHandler);

mongoose.connection.once("open", () => {
	server.listen(PORT, () => {
		console.log(`I love you ${PORT}`);
	});
});
