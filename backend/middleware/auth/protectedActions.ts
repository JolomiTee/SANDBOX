import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { createResponse } from "../../utils";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../../models/user.model";
import mongoose from "mongoose";

interface ExtReq extends Request {
	user: { _id: mongoose.Types.ObjectId } | JwtPayload;
}

export const protectedAction = async (
	req: ExtReq,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.cookies.sandbox_jwt;

		if (!token) {
			return res.status(StatusCodes.UNAUTHORIZED).json(
				createResponse({
					_code: StatusCodes.UNAUTHORIZED,
					_meaning: ReasonPhrases.UNAUTHORIZED,
					message: "Unauthorized: No token provided",
				})
			);
		}

		// Verify the token
		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string
		) as jwt.JwtPayload;

		if (!decoded || !decoded.userId) {
			return res.status(StatusCodes.UNAUTHORIZED).json(
				createResponse({
					_code: StatusCodes.UNAUTHORIZED,
					_meaning: ReasonPhrases.UNAUTHORIZED,
					message: "Unauthorized: Invalid token",
				})
			);
		}

		const authenticatedUser = await userModel.findById(decoded.userId);

		if (!authenticatedUser) {
			return res.status(StatusCodes.NOT_FOUND).json(
				createResponse({
					_code: StatusCodes.NOT_FOUND,
					_meaning: ReasonPhrases.NOT_FOUND,
					message: "User not found",
				})
			);
		}

		req.user = authenticatedUser;

		next();
	} catch (error) {
		console.error("Error in protectedAction middleware:", error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
			createResponse({
				_code: StatusCodes.INTERNAL_SERVER_ERROR,
				_meaning: ReasonPhrases.INTERNAL_SERVER_ERROR,
				message: `Internal server error: ${(error as Error).message}`,
			})
		);
	}
};
