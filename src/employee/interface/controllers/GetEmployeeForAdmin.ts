import { GetEmployee } from "@/employee/app/usecases/GetEmployee";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { Request, Response } from "express";

type Dependencies = {
    getEmployee: GetEmployee;
};

const getEmployeeForAdminHandler = handler(
    ({ getEmployee  }: Dependencies ) => 
        async (req: Request, res: Response) => {
            const { employeeId } = req.params;
            
            const employee = await getEmployee(employeeId);

            res.status(HttpStatus.OK).json(employee);
        }
);

export { getEmployeeForAdminHandler };