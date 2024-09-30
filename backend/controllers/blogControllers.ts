import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import Blogs from "../models/blog.model";
import { BlogPostType } from "../types";
import { createResponse } from "../utils";

export const allBlogPosts = async (req: Request, res: Response) => {
	try {
		const blogs = await Blogs.find().lean();
		res.json(
			createResponse({
				_code: 200,
				_meaning: "Fetched all blog posts",
				data: blogs,
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

export const getBlogPost = async (req: Request, res: Response) => {
	const { id } = req.body;
	try {
		const blogPost = await Blogs.findById(id).lean();
		res.json(
			createResponse({
				_code: 200,
				_meaning: "Fetched blog post",
				data: [blogPost],
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

export const createBlogPost = async (req: Request, res: Response) => {};

export const editBlogPost = async (req: Request, res: Response) => {};

export const deleteBlogPost = async (req: Request, res: Response) => {};
