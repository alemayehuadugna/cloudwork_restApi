
import { AddEducation } from "@/freelancer/app/usecases/education/AddEducation";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	addEducation: AddEducation;
}

const { getBody } = makeValidator({
	body: Joi.object({
		institution: Joi.string().required(),
		dateAttended: Joi.object({
			start: Joi.date().iso().required(),
			end: Joi.date().iso().required()
		}).required(),
		degree: Joi.string(),
		areaOfStudy: Joi.string().required(),
		description: Joi.string().required()
	}).required(),
});

const addEducationHandler = handler(
	({ addEducation }: Dependencies) =>
		async (req, res) => {
			let { institution,
				dateAttended,
				degree,
				areaOfStudy,
				description } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const education = await addEducation({
				institution,
				dateAttended,
				degree,
				areaOfStudy,
				description,
				freelancerId: id
			});

			res.status(HttpStatus.OK).json({ data: education });
		});

export { addEducationHandler };