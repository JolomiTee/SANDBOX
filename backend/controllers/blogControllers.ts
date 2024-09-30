import { Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import mongoose from "mongoose";
import blogModel from "../models/blog.model";
import { BlogPostType } from "../types";
import { createResponse } from "../utils";

export const allBlogPosts = (req: Request, res: Response) => {
	res.send("this is the blog route");
};
