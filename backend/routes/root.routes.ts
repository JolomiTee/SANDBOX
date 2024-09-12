import express, { Request, Response } from "express";
import { rootController } from "../controllers/rootController";

const router = express.Router();

router.get("/", rootController);

export default router;
