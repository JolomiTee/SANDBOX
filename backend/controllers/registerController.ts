import { Request, Response } from "express";

export const registerController = (req: Request, res: Response) => {
	res.send("Register Route");
};
