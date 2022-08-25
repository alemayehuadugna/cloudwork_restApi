import { ChangeClientPassword } from "@/client/app/usecase/ChangeClientPassword";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
  changeClientPassword: ChangeClientPassword;
};

const { getBody } = makeValidator({
  body: Joi.object({
      oldPassword: Joi.string().required(),
      newPassword: Joi.string().required()
  }).required(),
});

const changeClientPasswordHandler = handler(({changeClientPassword}: Dependencies) => 
async (req, res) => {
    let {oldPassword, newPassword} = getBody(req);
    const idObject: any = req.auth.credentials.uid;
    const clientId: string = idObject.value;

    await changeClientPassword({oldPassword, newPassword, clientId});

    res.status(HttpStatus.OK).json({clientId: clientId});
});

export {changeClientPasswordHandler}
