import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from "types-joi";
import { GenerateToken } from '@/auth/app/usecases/GetAccessToken';

type Dependencies = {
	generateToken: GenerateToken;
};

const { getBody } = makeValidator({
	body: Joi.object({
		email: Joi.string().email().required(),
		password: Joi.string().min(8).required(),
	}).required(),
});

const loginHandler = function (userType) {
	return handler(
		({ generateToken }: Dependencies) =>
			async (req: Request, res: Response) => {
				const { email, password } = getBody(req);
				const accessToken = await generateToken({ email, password, userType });
				res.status(HttpStatus.OK).json(accessToken);
			}
	);
}

export { loginHandler };
