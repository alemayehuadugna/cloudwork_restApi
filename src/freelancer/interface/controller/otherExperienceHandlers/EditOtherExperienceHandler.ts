
import { EditOtherExperience } from '@/freelancer/app/usecases/otherExperience/EditOtherExperience';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';
import { makeValidator } from '@/_lib/http/validation/Validator';
import Joi from 'types-joi';

type Dependencies = {
	editOtherExperience: EditOtherExperience;
}

const { getBody, getParams } = makeValidator({
	params: Joi.object({
		otherExperienceId: Joi.string().required(),
	}).required(),
	body: Joi.object({
		subject: Joi.string().required(),
		description: Joi.string().required()
	}).required(),
});

const editOtherExperienceHandler = handler(
	({ editOtherExperience }: Dependencies) =>
		async (req, res) => {
			let { otherExperienceId } = getParams(req);
			let { subject, description } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const otherExperience = await editOtherExperience({
				subject, description, otherExperienceId, freelancerId: id
			});

			res.status(HttpStatus.OK).json({ data: { otherExperience } });
		});

export { editOtherExperienceHandler };
