import express from "express";
import {
	getAllEmployees,
	getEmployee,
} from "../controllers/employees.controller";
const router = express.Router();

router.route("/").get(getAllEmployees);


router.route("/:id").get(getEmployee);

module.exports = router;
