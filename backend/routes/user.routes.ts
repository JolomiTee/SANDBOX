import express from "express";
import {
	loginController,
	logoutController,
	refreshController,
	registerController,
	rootController,
} from "../controllers/userControllers";

const router = express.Router();

router.get("/", rootController);

router.post("/login", loginController);

router.get("/logout", logoutController);

router.post("/refresh", refreshController);

router.post("/register", registerController);

export default router;
