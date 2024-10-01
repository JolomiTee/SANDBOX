import { BlogPostType } from "../types";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const BlogPostSchema = new Schema<BlogPostType>({
	title: {
		type: String,
		required: true,
	},
	category: {
		type: [String],
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export = mongoose.model("Blog", BlogPostSchema);
