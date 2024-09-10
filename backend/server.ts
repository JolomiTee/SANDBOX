import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// The basic way to send content or apis via route is the .get() route interceptor
app.get("/", (req: Request, res: Response) => {
	res.send("Hello Taiwo");
	// If you wanted to send a file to the port on request of the endpoint, you'd have this:
	// res.sendFile('./path/to/file', {root: __dirname})
	// Or
	// res.sendFile(path.join(__dirname, 'views', 'index.html'))
});

// Pages can accept a redirect
app.get("/old-page.html", (req: Request, res: Response) => {
	res.redirect(301, "/new-page.html"); // 302 by default which is temporary redirect
});

// and pages that are not found can be handled
app.get("/*", (req: Request, res: Response) => {
	res
		.status(StatusCodes.NOT_FOUND)
		.redirect(path.join(__dirname, "views", "/404.html")); // 404 returns page that arent found
});

// Route handlers can also be chained by the next() function, and also as an array
// method 1
app.get(
	"/",
	(req: Request, res: Response, next: NextFunction) => {
		console.log("attempted to load function");
		next();
	},
	(req: Request, res: Response) => {
		res.send("Hello Taiwo");
	}
);

const one = (req: Request, res: Response, next: NextFunction) => {
	console.log("This is one");
	next();
};
const two = (req: Request, res: Response, next: NextFunction) => {
	console.log("This is two");
	next();
};
const three = (req: Request, res: Response, next: NextFunction) => {
	console.log("This is one");
	res.send("finished");
};
// method 2
app.get("/chain(.html)?", [one, two, three]);

app.listen(PORT, () => {
	console.log(`I love you ${PORT}`);
});
