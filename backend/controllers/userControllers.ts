import { Request, Response } from "express";
import { UserType } from "../types";
import userModel from "../models/user.model";
import { StatusCodes, ReasonPhrases } from "http-status-codes";
import { createResponse } from "../utils";
import bcrypt from "bcryptjs";

export const rootController = (req: Request, res: Response) => {
	res.send("Root Route");
};

export const authController = (req: Request, res: Response) => {
	res.send("Auth Route");
};

export const logoutController = (req: Request, res: Response) => {
	res.send("Logout Route");
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
	const existingUser = await userModel.findOne({ emailAddress });
	if (existingUser) {
		return res.status(StatusCodes.CONFLICT).json(
			createResponse({
				_code: StatusCodes.CONFLICT,
				_meaning: ReasonPhrases.CONFLICT,
				message: "A user with this email already exists",
			})
		);
	}

	const takenUsername = await userModel.findOne({ userName });
	if (takenUsername) {
		return res.status(StatusCodes.CONFLICT).json(
			createResponse({
				_code: StatusCodes.CONFLICT,
				_meaning: ReasonPhrases.CONFLICT,
				message: "A user with this userName already exists",
			})
		);
	}

	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = new userModel({
		fullName,
		userName,
		emailAddress,
		password: hashedPassword,
	});

	try {
		await userModel.create(newUser);
		res.status(StatusCodes.CREATED).json(
			createResponse({
				_code: StatusCodes.CREATED,
				_meaning: ReasonPhrases.CREATED,
				data: [
					{
						User: {
							"full name": fullName,
							username: userName,
							"email address": emailAddress,
						},
					},
				],
			})
		);
	} catch (error) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
			createResponse({
				_code: StatusCodes.INTERNAL_SERVER_ERROR,
				_meaning: ReasonPhrases.INTERNAL_SERVER_ERROR,
				message: `${(error as Error).message}`,
			})
		);
	}
};
