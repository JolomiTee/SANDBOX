import mongoose from "mongoose";

export const connectMgDb = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI!);
		console.log("MongoDB connected successfully");
	} catch (error) {
		console.error(`MongoDB Connection Error: ${(error as Error).message}`);
		throw new Error(`MongoDB Error: ${(error as Error).message}`);
	}
};
