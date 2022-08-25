import { CreateFreelancer } from "@/freelancer/app/usecases/CreateFreelancer";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from "types-joi";

type Dependencies = {
	createFreelancer: CreateFreelancer;
};

const { getBody } = makeValidator({
	body: Joi.object({
		firstName: Joi.string().required(),
		lastName: Joi.string().required(),
		phone: Joi.string().required(),
		email: Joi.string().required(),
		password: Joi.string().required(),
		isPolicyAgreed: Joi.boolean().required(),
	}).required(),
});

const createFreelancerHandler = handler(
	({ createFreelancer }: Dependencies) =>
		async (req: Request, res: Response) => {
			let {
				firstName,
				lastName,
				phone,
				email,
				password,
				isPolicyAgreed
			} = getBody(req);

			const FreelancerId = await createFreelancer({
				firstName,
				lastName,
				phone,
				email,
				password,
				isPolicyAgreed
			});

			res.status(HttpStatus.OK).json({
				data: FreelancerId
			});
		}
);

export { createFreelancerHandler };
