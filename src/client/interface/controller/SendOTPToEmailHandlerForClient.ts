
import { SendOTPToClientEmail } from "@/client/app/usecase/OTP/SendOTPToClientEmail";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
    sendOTPToClientEmail: SendOTPToClientEmail;
};

const {getBody} = makeValidator({
    body: Joi.object({
        email: Joi.string().required(),
    }).required()
})

const makeSendOTPToEmailHandlerForClient = function(otpFor) {
    return handler(({sendOTPToClientEmail}: Dependencies) => 
        async (req, res) => {
            let {email} = getBody(req);

            console.log(email);

            await sendOTPToClientEmail({email, otpFor});

            res.status(HttpStatus.OK).send();
        }
    )
}

export {makeSendOTPToEmailHandlerForClient}