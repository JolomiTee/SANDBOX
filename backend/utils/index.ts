import { ApiResponse } from "../types";

export const createResponse = ({
	_code,
	_meaning,
	message,
	data,
}: {
	_code: number;
	_meaning: string;
	message?: string;
	data?: any[];
}): ApiResponse => {
	return {
		_code,
		_meaning,
		message,
		data,
	};
};
