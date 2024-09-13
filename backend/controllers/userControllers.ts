import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";
import mongoose from "mongoose";
import { generateTokenAndSetCookie } from "../middleware/jwt/generateJwt";
import userModel from "../models/user.model";
import { UserType } from "../types";
import { createResponse } from "../utils";
interface ExtReq extends Request {
	user?: { _id: mongoose.Types.ObjectId } | JwtPayload;
}

export const loginController = async (req: Request, res: Response) => {
	const { userName, password } = req.body;

	try {
		// Check if user exists
		const user = await userModel.findOne({ userName });
		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json(
				createResponse({
					_code: StatusCodes.NOT_FOUND,
					_meaning: ReasonPhrases.NOT_FOUND,
					message: "User not found",
				})
			);
		}

		// Verify password
		const validPassword = await bcrypt.compare(password, user.password);
		if (!validPassword) {
			return res.status(StatusCodes.UNAUTHORIZED).json(
				createResponse({
					_code: StatusCodes.UNAUTHORIZED,
					_meaning: ReasonPhrases.UNAUTHORIZED,
					message: "Invalid credentials",
				})
			);
		}

		// Generate token and set it in cookies
		generateTokenAndSetCookie(user._id, res);

		// Success response
		return res.status(StatusCodes.OK).json(
			createResponse({
				_code: StatusCodes.OK,
				_meaning: ReasonPhrases.OK,
				message: "Login successful",
				data: [user],
			})
		);
	} catch (error) {
		console.error(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
			createResponse({
				_code: StatusCodes.INTERNAL_SERVER_ERROR,
				_meaning: ReasonPhrases.INTERNAL_SERVER_ERROR,
				message: `${(error as Error).message}`,
			})
		);
	}
};

export const logoutController = (req: Request, res: Response) => {
	try {
		res.cookie("sandbox_jwt", "", { maxAge: 0 });
		return res.status(StatusCodes.OK).json(
			createResponse({
				_code: StatusCodes.OK,
				_meaning: ReasonPhrases.OK,
				message: "Logged Out",
			})
		);
	} catch (error) {
		console.error(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
			createResponse({
				_code: StatusCodes.INTERNAL_SERVER_ERROR,
				_meaning: ReasonPhrases.INTERNAL_SERVER_ERROR,
				message: `${(error as Error).message}`,
			})
		);
	}
};

export const registerController = async (req: Request, res: Response) => {
	const { userName, fullName, password, emailAddress }: UserType = req.body;

	//? I opted for returning a json response instead of throwing an error which maigh not be good in the long run
	//! I think client side validation is also good, but for the sake of being thorough, i could validate individual fields.. but i wont for now
	if (!userName || !emailAddress || !password || !fullName) {
		return res.status(400).json(
			createResponse({
				_code: StatusCodes.BAD_REQUEST,
				_meaning: ReasonPhrases.BAD_REQUEST,
				message: "UserName, email, full name, and password are required.",
			})
		);
	}

	//? after validating fields, check if the user exists, find the email since its supposed to be unique for evrybdy.
	// if it does, send a conflict response, else proceed
	const existingUser = await userModel.findOne({
		$or: [{ emailAddress }, { userName }],
	});

	if (existingUser?.emailAddress === emailAddress) {
		return res.status(StatusCodes.CONFLICT).json(
			createResponse({
				_code: StatusCodes.CONFLICT,
				_meaning: ReasonPhrases.CONFLICT,
				message: "A user with this email already exists",
			})
		);
	}

	//? I also think these two checks can be merged into one
	if (existingUser?.userName === userName) {
		return res.status(StatusCodes.CONFLICT).json(
			createResponse({
				_code: StatusCodes.CONFLICT,
				_meaning: ReasonPhrases.CONFLICT,
				message: "A user with this userName already exists",
			})
		);
	}

	const hashedPassword = await bcrypt.hash(password, 10);

	try {
		const newUser = await userModel.create({
			fullName,
			userName,
			emailAddress,
			password: hashedPassword,
		});

		return res.status(StatusCodes.CREATED).json(
			createResponse({
				_code: StatusCodes.CREATED,
				_meaning: ReasonPhrases.CREATED,
				data: [newUser],
			})
		);
	} catch (error) {
		console.error(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
			createResponse({
				_code: StatusCodes.INTERNAL_SERVER_ERROR,
				_meaning: ReasonPhrases.INTERNAL_SERVER_ERROR,
				message: `${(error as Error).message}`,
			})
		);
	}
};

export const authenticatedUser = async (req: ExtReq, res: Response) => {
	try {
		// Check if req.user is defined and has an id
		if (!req.user || !("_id" in req.user)) {
			return res.status(StatusCodes.UNAUTHORIZED).json(
				createResponse({
					_code: StatusCodes.UNAUTHORIZED,
					_meaning: ReasonPhrases.UNAUTHORIZED,
					message: "Unauthorized: User information is missing",
				})
			);
		}

		const user = await userModel.findById(req.user._id);

		if (!user) {
			return res.status(StatusCodes.NOT_FOUND).json(
				createResponse({
					_code: StatusCodes.NOT_FOUND,
					_meaning: ReasonPhrases.NOT_FOUND,
					message: "User not found",
				})
			);
		}

		return res.status(StatusCodes.OK).json(
			createResponse({
				_code: StatusCodes.OK,
				_meaning: ReasonPhrases.OK,
				data: [user],
			})
		);
	} catch (error) {
		console.error(error);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
			createResponse({
				_code: StatusCodes.INTERNAL_SERVER_ERROR,
				_meaning: ReasonPhrases.INTERNAL_SERVER_ERROR,
				message: `Internal server error: ${(error as Error).message}`,
			})
		);
	}
};

export const refreshController = async (req: Request, res: Response) => {
	const cookies = req.cookies;
	if (!cookies?.sandbox_jwt)
		return res.status(StatusCodes.UNAUTHORIZED).json(
			createResponse({
				_code: StatusCodes.UNAUTHORIZED,
				_meaning: ReasonPhrases.UNAUTHORIZED,
				message: "Unauthorized: Missing token(s)",
			})
		);

	const refreshToken = cookies.sandbox_jwt;

	res.clearCookie("sandbox_jwt", {
		httpOnly: true,
		sameSite: "none",
		secure: true,
	});

	// const foundUser = await userModel.findOne({ refreshToken }).exec();

	// // Detected refresh token reuse!
	// if (!foundUser) {
	// 	jwt.verify(
	// 		refreshToken,
	// 		process.env.REFRESH_TOKEN_SECRET as string,
	// 		async (
	// 			err: VerifyErrors | null,
	// 			decoded: JwtPayload | string | undefined
	// 		) => {
	// 			if (err) {
	// 				return res.status(StatusCodes.FORBIDDEN).json(
	// 					createResponse({
	// 						_code: StatusCodes.FORBIDDEN,
	// 						_meaning: ReasonPhrases.FORBIDDEN,
	// 						message: "No refresh token detected",
	// 					})
	// 				);
	// 			}

	// 			// Ensure decoded is of type JwtPayload if you're accessing properties on it
	// 			if (decoded && typeof decoded !== "string") {
	// 				// If token reuse is detected, delete refresh tokens of hacked user
	// 				const hackedUser = await userModel
	// 					.findOne({ userName: decoded.userName })
	// 					.exec();
	// 				if (hackedUser) {
	// 					hackedUser.refreshToken = [];
	// 					await hackedUser.save();
	// 				}

	// 				return res.status(StatusCodes.FORBIDDEN).json(
	// 					createResponse({
	// 						_code: StatusCodes.FORBIDDEN,
	// 						_meaning: ReasonPhrases.FORBIDDEN,
	// 						message: "Token reuse detected",
	// 					})
	// 				);
	// 			}
	// 		}
	// 	);
	// 	return;
	// }

	// const newRefreshTokenArray = foundUser.refreshToken.filter(
	// 	(rt) => rt !== refreshToken
	// );

	// // Evaluate JWT
	// jwt.verify(
	// 	refreshToken,
	// 	process.env.REFRESH_TOKEN_SECRET as string,
	// 	async (
	// 		err: VerifyErrors | null,
	// 		decoded: JwtPayload | string | undefined
	// 	) => {
	// 		if (err) {
	// 			// Expired refresh token
	// 			foundUser.refreshToken = [...newRefreshTokenArray];
	// 			await foundUser.save();
	// 			return res.status(StatusCodes.FORBIDDEN).json(
	// 				createResponse({
	// 					_code: StatusCodes.FORBIDDEN,
	// 					_meaning: ReasonPhrases.FORBIDDEN,
	// 					message: "Expired refresh token",
	// 				})
	// 			);
	// 		}

	// 		if (!decoded || foundUser.userName !== decoded.userName) {
	// 			return res.status(StatusCodes.FORBIDDEN).json(
	// 				createResponse({
	// 					_code: StatusCodes.FORBIDDEN,
	// 					_meaning: ReasonPhrases.FORBIDDEN,
	// 					message: "Invalid token",
	// 				})
	// 			);
	// 		}

	// 		// Refresh token was still valid
	// 		const accessToken = jwt.sign(
	// 			{
	// 				UserInfo: {
	// 					userName: decoded.userName,
	// 				},
	// 			},
	// 			process.env.ACCESS_TOKEN_SECRET as string,
	// 			{ expiresIn: "10m" } // Use a longer expiration for access tokens in production
	// 		);

	// 		const newRefreshToken = jwt.sign(
	// 			{ userName: foundUser.userName },
	// 			process.env.REFRESH_TOKEN_SECRET as string,
	// 			{ expiresIn: "15d" } // Extend refresh token expiration
	// 		);

	// 		// Saving refreshToken with current user
	// 		foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
	// 		await foundUser.save();

	// 		// Creates Secure Cookie with the new refresh token
	// 		res.cookie("sandbox_jwt", newRefreshToken, {
	// 			httpOnly: true,
	// 			secure: true,
	// 			sameSite: "none",
	// 			maxAge: 24 * 60 * 60 * 1000, // 1 day
	// 		});

	// 		return res.status(StatusCodes.OK).json(
	// 			createResponse({
	// 				_code: StatusCodes.OK,
	// 				_meaning: ReasonPhrases.OK,
	// 				message: "Token refreshed successfully",
	// 				data: [{ accessToken }],
	// 			})
	// 		);
	// 	}
	// );

	return res.status(StatusCodes.OK).json(
		createResponse({
			_code: StatusCodes.OK,
			_meaning: ReasonPhrases.OK,
			data: [
				{
					cookie: req.cookies,
				},
			],
		})
	);
};
