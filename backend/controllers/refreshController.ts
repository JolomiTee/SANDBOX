import { Request, Response } from "express";

export const refreshController = (req: Request, res: Response) => {
	res.send("Refresh Route");
};
