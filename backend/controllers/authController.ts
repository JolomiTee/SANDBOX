import { Request, Response } from "express";

export const authController = (req: Request, res: Response) => {
	res.send("Auth Route");
};
