import express from "express";
import {
	authController,
	logoutController,
	refreshController,
	registerController,
	rootController,
} from "../controllers/userControllers";

const router = express.Router();

router.get("/", rootController);

router.post("/auth", authController);

router.get("/logout", logoutController);

router.post("/refresh", refreshController);

router.post("/register", registerController);

export default router;
