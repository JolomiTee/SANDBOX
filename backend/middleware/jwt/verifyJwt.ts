import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";

// Define the custom structure of your decoded token's payload
interface DecodedUserInfo extends JwtPayload {
	userId: mongoose.Types.ObjectId;
}

interface JWTRequest extends Request {
	user?: {
		_id: mongoose.Types.ObjectId;
	}; // User is optional because it may not exist on all requests
}

const verifyJWT = (req: JWTRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;

	// Check if authHeader is a string, and ensure it starts with 'Bearer '
	if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
		return res.sendStatus(401); // Unauthorized
	}

	// Extract the token from the authorization header
	const token = authHeader.split(" ")[1];

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, decoded) => {
		if (err) return res.sendStatus(403); // Forbidden (invalid token)

		// Type assertion to ensure that 'decoded' has the expected structure
		const decodedToken = decoded as DecodedUserInfo;

		// Assign the extracted userId to the request object
		req.user = { _id: decodedToken.userId };

		next();
	});
};

export default verifyJWT;
