import { EditEducation } from '@/freelancer/app/usecases/education/EditEducation';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';
import { makeValidator } from '@/_lib/http/validation/Validator';
import Joi from 'types-joi';

type Dependencies = {
	editEducation: EditEducation;
}

const { getBody, getParams } = makeValidator({
	params: Joi.object({
		educationId: Joi.string().required(),
	}).required(),
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

const editEducationHandler = handler(
	({ editEducation }: Dependencies) =>
		async (req, res) => {
			let { educationId } = getParams(req);
			let { institution,
				dateAttended,
				degree,
				areaOfStudy,
				description } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const education = await editEducation({
				institution,
				dateAttended,
				degree,
				areaOfStudy,
				description,
				educationId,
				freelancerId: id
			});

			res.status(HttpStatus.OK).json({ data: education });
		});

export { editEducationHandler };