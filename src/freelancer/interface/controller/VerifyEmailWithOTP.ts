import { VerifyEmailWithOTP } from "@/freelancer/app/usecases/VerifyEmailWithOTP"
import { makeValidator } from '@/_lib/http/validation/Validator';
import Joi from 'types-joi';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
	verifyEmailWithOTP: VerifyEmailWithOTP;
};

const { getBody } = makeValidator({
	body: Joi.object({
		code: Joi.string().length(4).required(),
		email: Joi.string().email().required()
	}).required(),
});

const verifyEmailWithOTPHandler = handler(
	({ verifyEmailWithOTP }: Dependencies) =>
		async (req, res) => {
			let { code, email } = getBody(req);

			const token = await verifyEmailWithOTP({ otpCode: code, email });

			res.status(HttpStatus.OK).json({ 'token': token });
		}
);

export { verifyEmailWithOTPHandler };