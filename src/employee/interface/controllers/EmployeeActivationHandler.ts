import { EmployeeActivation } from "@/employee/app/usecases/EmployeeActivation";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
    employeeActivation: EmployeeActivation;
};

const { getBody } = makeValidator({
	body: Joi.object({
		state: Joi.string().required(),
	}).required(),
});

const employeeActivationHandler = handler(({ employeeActivation }: Dependencies) => async (req, res) => {
    const { employeeId } = req.params;
    let {state} = getBody(req);

    await employeeActivation({employeeId, state});

    res.status(HttpStatus.OK).send();
});

export { employeeActivationHandler };