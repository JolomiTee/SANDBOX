import { Request, Response } from "express";

export const rootController = (req: Request, res: Response) => {
	res.send("Root Route");
};
