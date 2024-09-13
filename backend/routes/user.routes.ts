import express from "express";
import {
	authenticatedUser,
	loginController,
	logoutController,
	refreshController,
	registerController,
} from "../controllers/userControllers";
import { protectedAction } from "../middleware/auth/protectedActions";

const router = express.Router();

router.post("/login", loginController);

router.post("/logout", logoutController);

router.post("/refresh", refreshController);

router.post("/register", registerController);

router.get("/user", protectedAction, authenticatedUser);

export default router;
