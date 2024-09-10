// import employees from "../model/employees.json";

// const data = {
// 	employees: employees,
// 	setEmployees: function (data: any) {
// 		this.employees = data;
// 	},
// };

export const getAllEmployees = (req: any, res: any) => {
	res.json(data.employees);
};

// export const createNewEmployee = (req, res) => {
// 	const newEmployee = {
// 		id: data.employees[data.employees.length - 1].id + 1 || 1,
// 		firstname: req.body.firstname,
// 		lastname: req.body.lastname,
// 	};

// 	if (!newEmployee.firstname || !newEmployee.lastname) {
// 		return res
// 			.status(400)
// 			.json({ message: "First and last names are required" });
// 	}

// 	data.setEmployees([...data.employees, newEmployee]);
// 	res.status(201).json(data.employees);
// };

export const updateEmployee = (req, res) => {
	const employee = data.employees.find(
		(emp) => emp.id === parseInt(req.body.id)
	);
	if (!employee) {
		return res
			.status(400)
			.json({ message: `Employee ID ${req.body.id} not found` });
	}
	if (req.body.firstname) employee.firstname = req.body.firstname;
	if (req.body.lastname) employee.lastname = req.body.lastname;
	const filteredArray = data.employees.filter(
		(emp) => emp.id !== parseInt(req.body.id)
	);
	const unsortedArray = [...filteredArray, employee];
	data.setEmployees(
		unsortedArray.sort((a, b) => (a.id > b.id ? 1 : a.id < b.id ? -1 : 0))
	);
	res.json(data.employees);
};

// export const deleteEmployee = (req, res) => {
// 	const employee = data.employees.find(
// 		(emp) => emp.id === parseInt(req.body.id)
// 	);
// 	if (!employee) {
// 		return res
// 			.status(400)
// 			.json({ message: `Employee ID ${req.body.id} not found` });
// 	}
// 	const filteredArray = data.employees.filter(
// 		(emp) => emp.id !== parseInt(req.body.id)
// 	);
// 	data.setEmployees([...filteredArray]);
// 	res.json(data.employees);
// };

// export const getEmployee = (req, res) => {
// 	const employee = data.employees.find(
// 		(emp) => emp.id === parseInt(req.body.id)
// 	);
// 	if (!employee) {
// 		return res
// 			.status(400)
// 			.json({ message: `Employee ID ${req.body.id} not found` });
// 	}
// 	res.json(employee);
// };
