import express from "express";
import { protectedAction } from "../middleware/auth/protectedActions";
import { allBlogPosts } from "../controllers/blogControllers";
const router = express.Router();

router.get("/", allBlogPosts);

export default router;
