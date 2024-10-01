import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Blogs from "../models/blog.model";
import { BlogPostType } from "../types";
import { createResponse } from "../utils";
import { authenticatedUser } from "./userControllers";
import mongoose from "mongoose";
import { JwtPayload } from "jsonwebtoken";

interface ExtReq extends Request {
	user?: { _id: mongoose.Types.ObjectId } | JwtPayload;
}

export const allBlogPosts = async (req: Request, res: Response) => {
	try {
		const blogs = await Blogs.find().lean();
		if (blogs) {
			res.status(StatusCodes.OK).json(
				createResponse({
					_code: 200,
					_meaning: "Fetched all blog posts",
					data: blogs,
				})
			);
		} else {
			res.status(StatusCodes.NOT_FOUND).json(
				createResponse({
					_code: StatusCodes.NOT_FOUND,
					_meaning: "No blog posts yet",
				})
			);
		}
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

export const getBlogPost = async (req: Request, res: Response) => {
	const { id } = req.body;
	try {
		const blogPost = await Blogs.findById(id).lean();

		if (blogPost) {
			res.status(StatusCodes.OK).json(
				createResponse({
					_code: StatusCodes.OK,
					_meaning: "Fetched blog post",
					data: [blogPost],
				})
			);
		} else {
			res.status(StatusCodes.NOT_FOUND).json(
				createResponse({
					_code: StatusCodes.NOT_FOUND,
					_meaning: "Blog post not found",
				})
			);
		}
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

export const createBlogPost = async (req: ExtReq, res: Response) => {
	const { title, content, category } = req.body;
	const user = req.user?._id;

	if (!title || !content || !category) {
		return res.status(StatusCodes.BAD_REQUEST).json(
			createResponse({
				_code: StatusCodes.BAD_REQUEST,
				_meaning: ReasonPhrases.BAD_REQUEST,
				message: "All fields are required",
			})
		);
	}

   const categoryArray = category.split(",").map((cat: string) => cat.trim());

		try {
			const newBlogPost = await Blogs.create({
				title,
				content,
				category: categoryArray,
				author: user,
			});

			return res.status(StatusCodes.CREATED).json(
				createResponse({
					_code: StatusCodes.CREATED,
					_meaning: ReasonPhrases.CREATED,
					data: [newBlogPost],
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

export const editBlogPost = async (req: Request, res: Response) => {};

export const deleteBlogPost = async (req: Request, res: Response) => {};
