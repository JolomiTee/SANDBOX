import { logLocalEvents } from "./logLocalEvents";

export const errorHandler = (error: Error, req: any, res: any, next: any) => {
	logLocalEvents(`${error.name}: ${error.message}`, "errLog.txt");

	console.error(error.stack);
   res.status(500).send(error.message);
   next();
};
