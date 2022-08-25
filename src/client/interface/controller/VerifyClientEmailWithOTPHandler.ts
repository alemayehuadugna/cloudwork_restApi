import { VerifyClientEmailWithOTP } from "@/client/app/usecase/OTP/VerifyClientEmailWithOTP"
import { handler } from "@/_lib/http/handler"
import { HttpStatus } from "@/_lib/http/HttpStatus"
import { makeValidator } from "@/_lib/http/validation/Validator"
import Joi from "types-joi"

type Dependencies = {
    verifyClientEmailWithOTP : VerifyClientEmailWithOTP
}

const {getBody} = makeValidator({
    body: Joi.object({
        code: Joi.string().length(4).required(),
        email: Joi.string().email().required()
    }).required(),
})

const verifyClientEmailWithOTPHandler = handler(({verifyClientEmailWithOTP}: Dependencies) => 
    async (req, res) => {
        let {code , email} = getBody(req);

        const token = await verifyClientEmailWithOTP({otpCode: code, email: email});

        res.status(HttpStatus.OK).json({'token': token});
    }
)

export {verifyClientEmailWithOTPHandler}