import { EditEmployment } from '@/freelancer/app/usecases/employment/EditEmployment';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';
import { makeValidator } from '@/_lib/http/validation/Validator';
import Joi from 'types-joi';

type Dependencies = {
	editEmployment: EditEmployment;
}

const { getBody, getParams } = makeValidator({
	params: Joi.object({
		employmentId: Joi.string().required(),
	}).required(),
	body: Joi.object({
		company: Joi.string().required(),
		city: Joi.string().required(),
		region: Joi.string().required(),
		title: Joi.string().required(),
		period: Joi.object({
			start: Joi.date().iso().required(),
			end: Joi.date().iso().required()
		}).required(),
		summary: Joi.string().required()
	}).required(),
});

const editEmploymentHandler = handler(
	({ editEmployment }: Dependencies) =>
		async (req, res) => {
			let { employmentId } = getParams(req);
			let { company,
				city,
				region,
				title,
				period,
				summary } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const uid: string = idObject.value;

			const employment = await editEmployment({
				company,
				city,
				region,
				title,
				period,
				summary,
				id: employmentId,
				freelancerId: uid
			});

			res.status(HttpStatus.OK).json({ data: employment });
		});

export { editEmploymentHandler };