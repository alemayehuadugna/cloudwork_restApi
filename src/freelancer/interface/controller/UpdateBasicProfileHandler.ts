import { UpdateBasicProfile } from "@/freelancer/app/usecases/UpdateBasicProfile"
import { handler } from "@/_lib/http/handler";
import { makeValidator } from '@/_lib/http/validation/Validator';
import { Request, Response } from "express";
import Joi from 'types-joi';
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
	updateBasicProfile: UpdateBasicProfile;
}

const { getBody } = makeValidator({
	body: Joi.object({
		available: Joi.string().valid('Full Time', 'Part Time', 'Not Available').required(),
		gender: Joi.string().valid("Male", "Female").required()
	}).required(),
});

const updateBasicProfileHandler = handler(
	({ updateBasicProfile }: Dependencies) =>
		async (req: Request, res: Response) => {
			let {
				available,
				gender
			} = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			let temp: "Full Time" | "Part Time" | "Not Available" =
				available === 'Full Time' ? 'Full Time' :
					available === 'Part Time' ? 'Part Time' : 'Not Available';

			const freelancerId = await updateBasicProfile({
				available: temp,
				gender,
				id
			});

			res.status(HttpStatus.OK).json({ data: { freelancerId } });
		});

export { updateBasicProfileHandler };