import { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

// to make the file a module and avoid the TypeScript error
export {};

declare global {
	namespace Express {
		export interface Request {
			// user?: Record<string, any>;
			user: { _id: mongoose.Types.ObjectId } | JwtPayload;
		}
	}
}
