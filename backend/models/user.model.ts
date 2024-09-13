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
		refreshToken: {
			type: [String],
		},
	},
	{
		timestamps: true,
	}
);

UserSchema.methods.toJSON = function () {
	const userObject = this.toObject();
	delete userObject.password;
	return userObject;
};

export = mongoose.model("User", UserSchema);
