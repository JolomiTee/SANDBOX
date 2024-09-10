import { format } from "date-fns";
import { v4 as uuid } from "uuid";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import { Request, Response, NextFunction } from "express";

// Type annotations for function parameters
const logEvents = async (messages: string, logName: string): Promise<void> => {
	const dateTime = `${format(new Date(), "yyyy-MM-dd\tHH:mm:ss")}`;
	const logItem = `${dateTime}\t${uuid()}\t${messages}\n`;

	console.log(logItem);
	try {
		const logDir = path.join(__dirname, "..", "logs");
		if (!fs.existsSync(logDir)) {
			await fsPromises.mkdir(logDir);
		}
		await fsPromises.appendFile(path.join(logDir, logName), logItem);
	} catch (err) {
		console.error(err);
	}
};

// Logger middleware with express Request, Response, NextFunction types
const logger = (req: Request, res: Response, next: NextFunction): void => {
	logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
	console.log(`${req.method} ${req.path}`);
	next();
};

// Exporting with type-safe modules
export { logEvents, logger };
