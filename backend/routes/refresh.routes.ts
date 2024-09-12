import express from "express";
import { refreshController } from "../controllers/refreshController";

const router = express.Router();

router.post("/", refreshController);

export default router;
