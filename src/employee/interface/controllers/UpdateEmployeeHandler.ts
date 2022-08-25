import { UpdateEmployee } from "@/employee/app/usecases/UpdateEmployee";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
    updateEmployee: UpdateEmployee;
};

const { getBody } = makeValidator({
    // body: Joi.object({
    //     firstName: Joi.string().required(),
	// 	lastName: Joi.string().required(),
	// 	phone: Joi.string().required(),
	// 	email: Joi.string().required(),
	// 	gender: Joi.string().valid('Male', 'Female').required()
    // }).required(),
}
);
 

const updateEmployeeHandler = handler(
    ({ updateEmployee }: Dependencies) =>
        async (req, res) => {
            const { employeeId } = req.params;
            let {
                firstName,
                lastName,
                phone,
                email,
                gender
            } = getBody(req);

            const employee = await updateEmployee({
                employeeId,
                firstName,
                lastName, 
                phone,
                email,
                gender,
            });

            res.status(HttpStatus.OK).json({
                data: employee
            });
        }
);

export { updateEmployeeHandler };