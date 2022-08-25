import { ChangeEmployeePassword } from "@/employee/app/usecases/ChangeEmployeePassword";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
  changeEmployeePassword: ChangeEmployeePassword;
};

const { getBody } = makeValidator({
  // body: Joi.object({
  //     oldPassword: Joi.string().required(),
  //     newPassword: Joi.string().required()
  // }).required(),
});

const changeEmployeePasswordHandler = handler(({changeEmployeePassword}: Dependencies) => 
async (req, res) => {
    let {oldPassword, newPassword} = getBody(req);
    const idObject: any = req.auth.credentials.uid;
    const employeeId: string = idObject.value;

    await changeEmployeePassword({oldPassword, newPassword, employeeId});

    res.status(HttpStatus.OK).json({employeeId: employeeId});
});

export {changeEmployeePasswordHandler}
