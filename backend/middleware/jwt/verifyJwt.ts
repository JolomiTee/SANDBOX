import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define the custom structure of your decoded token's payload
interface DecodedUserInfo extends JwtPayload {
	UserInfo: {
		username: string;
		roles: string[];
	};
}

interface JWTRequest extends Request {
	user?: string; // User is optional because it may not exist on all requests
	roles?: string[]; // Same for roles
}

const verifyJWT = (req: JWTRequest, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization || req.headers.Authorization;

	// Check if authHeader is a string, and ensure it starts with 'Bearer '
	if (typeof authHeader !== "string" || !authHeader.startsWith("Bearer ")) {
		return res.sendStatus(401); // Unauthorized
	}

	// Extract the token from the authorization header
	const token = authHeader.split(" ")[1];

	jwt.verify(
		token,
		process.env.ACCESS_TOKEN_SECRET as string,
		(err, decoded) => {
			if (err) return res.sendStatus(403); // Forbidden (invalid token)

			// Type assertion to ensure that 'decoded' has the expected structure
			const decodedToken = decoded as DecodedUserInfo;

			// Assign the extracted username and roles to the request object
			req.user = decodedToken.UserInfo.username;
			req.roles = decodedToken.UserInfo.roles;

			next();
		}
	);
};

export default verifyJWT;
