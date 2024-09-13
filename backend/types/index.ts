import { ObjectId } from "mongoose";

export type UserType = {
	fullName: string;
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

export interface ApiResponse {
	_code: number;
	_meaning: string;
	message?: string;
	data?: any[];
}