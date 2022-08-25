import { Scope } from "@/auth/interface/controllers/AccessScopeHandler";
import { verifyTokenHandler } from "@/auth/interface/controllers/VerifyTokenHandler";
import { Router } from "express";
import { createEmployeeHandler } from "../controllers/CreateEmployeeHandler";
import { getEmployeeHandler } from "../controllers/GetEmployeeHandler";
import { listEmployeesHandler } from "../controllers/ListEmployeesHandler";
import { deleteEmployeeHandler } from "@/employee/interface/controllers/DeleteEmployeeHandler";
import { updateEmployeeHandler } from "../controllers/UpdateEmployeeHandler";
import { searchEmployeeHandler } from "../controllers/SearchEmployeesHandler";
import { getEmployeeForAdminHandler } from "../controllers/GetEmployeeForAdmin";
import { employeeActivationHandler } from "../controllers/EmployeeActivationHandler";
import { updateBasicProfileHandler } from "../controllers/UpdateBasicProfileHandler";
import { changeEmployeePasswordHandler } from "../controllers/ChangeEmployeePasswordHandler";


type Dependencies = {
    apiRouter: Router;
}

const makeEmployeeController = ({ apiRouter }: Dependencies) => {
    const router = Router();

    router.get("/list/employees", verifyTokenHandler, Scope(['Admin']), listEmployeesHandler)
    router.post("/employees", createEmployeeHandler);
    router.get("/employee/me", verifyTokenHandler, getEmployeeHandler);
    router.delete('/employees/:employeeId', deleteEmployeeHandler);
    router.patch('/update/employees/:employeeId', updateEmployeeHandler);
    router.patch("/employees/me/basic",verifyTokenHandler,updateBasicProfileHandler);
    router.patch("/employees/me/changePassword",verifyTokenHandler,changeEmployeePasswordHandler);
    router.get('/search/employees', searchEmployeeHandler);
    router.get('/employees/:employeeId', verifyTokenHandler, Scope(['Admin']), getEmployeeForAdminHandler);
    router.patch('/employees/deactivate/:employeeId', employeeActivationHandler);

    apiRouter.use(router);
};

export { makeEmployeeController };