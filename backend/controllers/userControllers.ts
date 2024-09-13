import { Request, Response } from "express";
import { UserType } from "../types";
import userModel from "../models/user.model";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { createResponse } from "../utils";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../middleware/jwt/generateJwt";

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

export const refreshController = (req: Request, res: Response) => {
	res.send("Refresh Route");
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
				message: "Username, email, full name, and password are required.",
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
				message: "A user with this username already exists",
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

export const authenticatedUser = async (req: Request, res: Response) => {
	// try {
	// 	const user = await userModel.findById(req.user._id);
	// 	return res.status(StatusCodes.OK).json(
	// 		createResponse({
	// 			_code: StatusCodes.OK,
	// 			_meaning: ReasonPhrases.OK,
	// 			data: [user],
	// 		})
	// 	);
	// } catch (error) {
	// 	console.error(error);
	// 	return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
	// 		createResponse({
	// 			_code: StatusCodes.INTERNAL_SERVER_ERROR,
	// 			_meaning: ReasonPhrases.INTERNAL_SERVER_ERROR,
	// 			message: `${(error as Error).message}`,
	// 		})
	// 	);
	// }
};