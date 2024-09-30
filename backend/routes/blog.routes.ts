import express from "express";
import { protectedAction } from "../middleware/auth/protectedActions";
import {
	allBlogPosts,
	createBlogPost,
	deleteBlogPost,
	editBlogPost,
	getBlogPost,
} from "../controllers/blogControllers";
const router = express.Router();

router.get("/", allBlogPosts);

router.post("/", protectedAction, createBlogPost);

router.get("/:id", getBlogPost);

router.put("/:id", protectedAction, editBlogPost);

router.delete("/:id", protectedAction, deleteBlogPost);


export default router;
