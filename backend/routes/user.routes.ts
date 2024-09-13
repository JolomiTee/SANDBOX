import express from "express";
import {
	authenticatedUser,
	loginController,
	logoutController,
	refreshController,
	registerController,
} from "../controllers/userControllers";

const router = express.Router();

router.post("/login", loginController);

router.post("/logout", logoutController);

router.post("/refresh", refreshController);

router.post("/register", registerController);

router.get("/user", authenticatedUser);

export default router;
