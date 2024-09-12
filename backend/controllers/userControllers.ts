import { Request, Response } from "express";

export const rootController = (req: Request, res: Response) => {
	res.send("Root Route");
};

export const authController = (req: Request, res: Response) => {
	res.send("Auth Route");
};

export const logoutController = (req: Request, res: Response) => {
	res.send("Register Route");
};

export const refreshController = (req: Request, res: Response) => {
	res.send("Refresh Route");
};

export const registerController = (req: Request, res: Response) => {
	res.send("Register Route");
};
