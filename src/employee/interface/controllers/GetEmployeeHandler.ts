import { GetEmployee } from "@/employee/app/usecases/GetEmployee";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { Request, Response } from "express";

type Dependencies = {
    getEmployee: GetEmployee;
};

const getEmployeeHandler = handler(
    ({ getEmployee  }: Dependencies ) => 
        async (req: Request, res: Response) => {
            const employeeId: any  = req.auth.credentials.uid;
            
            const employee = await getEmployee(employeeId.value);

            res.status(HttpStatus.OK).json(employee);
        }
);

export { getEmployeeHandler };