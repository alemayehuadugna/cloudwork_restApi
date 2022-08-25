import { ResetPassword } from "@/client/app/usecase/ResetPassword"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";


type Dependencies = {
    resetPassword: ResetPassword;
};

const {getBody} = makeValidator({
    body: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().required()
    }).required(),
});

const resetPasswordHandler = handler(({resetPassword}: Dependencies) => async (req, res) => {
    let {password, email} = getBody(req);
    
    let clientId = await resetPassword({email, password});
    console.log("client id", clientId);
    

    res.status(HttpStatus.OK).json({clientId: clientId});
});

export {resetPasswordHandler}