
import { CreateMilestone } from "@/milestone/app/useCases/CreateMilestone";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from 'types-joi';

type Dependencies = {
	createMilestone: CreateMilestone;
};

const { getBody } = makeValidator({
	body: Joi.object({
        Name: Joi.string().required(),
        Budget: Joi.number().required(),
   		StartDate: Joi.date().required(),
		EndDate: Joi.date().required(),
	}).required(),
});

const createMilestoneHandler = handler(
	({ createMilestone }: Dependencies) =>
		async (req: Request, res: Response) => {
			let {
				Name,
				Budget,
				StartDate,
				EndDate,

				
			} = getBody(req);

			const milestoneId = await createMilestone({
				Name,
				Budget,
				StartDate,
				EndDate,
			});

			res.status(HttpStatus.CREATED).json({ id: milestoneId });
		}
);

export { createMilestoneHandler };
