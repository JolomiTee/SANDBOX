import { ObjectId } from "mongoose";

export type UserType = {
	name: string;
	userName: string;
	emailAddress: string;
	password: string;
};

export type BlogPostType = {
	title: string;
	author: ObjectId;
	category: string;
	content: string;
	createdAt: Date;
};
