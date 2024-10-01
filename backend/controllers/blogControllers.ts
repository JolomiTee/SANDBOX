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

export const editBlogPost = async (req: ExtReq, res: Response) => {
	const { title, content, category } = req.body;
	try {
		const blog = await Blogs.findById(req.params.id);

		if (!blog) {
			return res.status(404).json({ error: "Blog not found" });
		}
		if (blog.author.toString() !== req.user?._id.toString()) {
			return res.status(401).json({ error: "You cannot edit this blog" });
		}

		if (title) blog.title = title;
		if (content) blog.content = content;
		if (category) {
			// Convert category to array if it's a comma-separated string
			blog.category = Array.isArray(category)
				? category
				: category.split(",").map((cat: string) => cat.trim());
		}

		const updatedBlog = await blog.save();

		res.status(200).json(
			createResponse({
				_code: StatusCodes.OK,
				_meaning: ReasonPhrases.OK,
				message: "Blog updated",
				data: [updatedBlog],
			})
		);
	} catch (error) {
		console.log("Error in deletePost controller", (error as Error).message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};

export const deleteBlogPost = async (req: ExtReq, res: Response) => {
	try {
		const blog = await Blogs.findById(req.params.id);
		if (!blog) {
			return res.status(404).json({ error: "Blog not found" });
		}
		if (blog.author.toString() !== req.user?._id.toString()) {
			return res.status(401).json({ error: "You cannot delete this blog" });
		}

		await Blogs.findByIdAndDelete(req.params.id);

		res.status(200).json({ message: "Blog deleted sucesfully" });
	} catch (error) {
		console.log("Error in deletePost controller", (error as Error).message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};
