import { UserType } from "../types";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserSchema = new Schema<UserType>(
	{
		fullName: {
			type: String,
			required: true,
		},
		userName: {
			type: String,
			required: true,
		},
		emailAddress: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

export = mongoose.model("User", UserSchema);
