import { AddOtherExperience } from "@/freelancer/app/usecases/otherExperience/AddOtherExperience";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	addOtherExperience: AddOtherExperience;
}

const { getBody } = makeValidator({
	body: Joi.object({
		subject: Joi.string().required(),
		description: Joi.string().required()
	}).required(),
});

const addOtherExperienceHandler = handler(
	({ addOtherExperience }: Dependencies) =>
		async (req, res) => {
			let { subject, description } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const otherExperience = await addOtherExperience({
				subject,
				description,
				freelancerId: id
			});

			res.status(HttpStatus.OK).json({ data: { otherExperience } });
		});

export { addOtherExperienceHandler };