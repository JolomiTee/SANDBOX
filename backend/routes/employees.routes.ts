import express from "express";
import {
	createNewEmployee,
	deleteEmployee,
	getAllEmployees,
	getEmployee,
	updateEmployee,
} from "../controllers/employees.controller";
const router = express.Router();

router
	.route("/")
	.get(getAllEmployees)
	.post(createNewEmployee)
	.put(updateEmployee)
	.delete(deleteEmployee);

router.route("/:id").get(getEmployee);

module.exports = router;
