import { handler } from "@/_lib/http/handler";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";
import { HttpStatus } from '@/_lib/http/HttpStatus';
import { SendOTPToEmail } from "@/freelancer/app/usecases/SendOTPToEmail";

type Dependencies = {
	sendOTPToEmail: SendOTPToEmail;
};

const { getBody } = makeValidator({
	body: Joi.object({
		email: Joi.string().required(),
	}).required()
})

const makeSendOTPToEmailHandler = function (otpFor) {
	return handler(({ sendOTPToEmail }: Dependencies) =>
		async (req, res) => {
			let { email } = getBody(req);
			
			await sendOTPToEmail({ email, otpFor});

			res.status(HttpStatus.OK).send();
		}
	)
}

export { makeSendOTPToEmailHandler };