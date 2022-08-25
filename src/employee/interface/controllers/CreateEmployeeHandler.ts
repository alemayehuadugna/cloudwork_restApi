import { CreateEmployee } from "@/employee/app/usecases/CreateEmployee";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { Request, Response } from "express";
import Joi from 'types-joi';
import { makeValidator } from "@/_lib/http/validation/Validator";

type Dependencies = {
    createEmployee: CreateEmployee;
};

const { getBody } = makeValidator({
	body: Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		phone: Joi.string().required(),
		email: Joi.string().required(),
		gender: Joi.string().valid('Male', 'Female').required(),
	}).required(),
});

const createEmployeeHandler = handler(
    ({ createEmployee }: Dependencies) =>
        async (req: Request, res: Response) => {
            let {
                firstName,
                lastName,
                phone,
                email,
                gender,
            } = getBody(req);

            const EmployeeId = await createEmployee({
                firstName,
                lastName,
                phone,
                email,
                gender,
            });

            res.status(HttpStatus.OK).json({ id: EmployeeId });
        }
);

export { createEmployeeHandler };