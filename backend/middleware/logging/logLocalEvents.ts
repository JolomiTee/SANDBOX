import { NextFunction, Request, Response } from "express";
import { format } from "date-fns";
import { v4 as uuid } from "uuid";

import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";

//? This logger middleware/function is a way of locally logging requests, and is not really a standard in production. A library like Winston or Datadog can be used for logging purposes.
// But Dave Gray does it so... why not

export const logLocalEvents = async (
	message: string | any,
	logName: string | any
) => {
	const timeStamp = `${format(new Date(), "yyyyMMdd\tHH:mm:ss:SSS")}`;
	const loggedItem = `${timeStamp}\t${uuid()}\t${message}`;

	try {
		if (!fs.existsSync(path.join(__dirname, "..", "..", "logs")))
			await fsPromises.mkdir(path.join(__dirname, "..", "..", "logs"));

		await fsPromises.appendFile(
			path.join(__dirname, "..", "..", "logs", logName),
			loggedItem
		);
	} catch (error) {
		console.log(error);
	}
};

export const reqLogger = (req: Request, res: Response, next: NextFunction) => {
	logLocalEvents(
		`-m: ${req.method}\t -o: ${req.headers.origin}\t -p: ${req.url}\n`,
		"reqLog.txt"
	);
	console.log(`${req.method}\t${req.path}`);
	next();
};
