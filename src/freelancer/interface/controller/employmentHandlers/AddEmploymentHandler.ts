
import { AddEmployment } from "@/freelancer/app/usecases/employment/AddEmployment";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	addEmployment: AddEmployment;
}

const { getBody } = makeValidator({
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

const addEmploymentHandler = handler(
	({ addEmployment }: Dependencies) =>
		async (req, res) => {
			let {
				company,
				city,
				region,
				title,
				period,
				summary } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const employment = await addEmployment({
				company, city, region, title, period, summary, id
			});

			res.status(HttpStatus.OK).json({ data: employment });
		});

export { addEmploymentHandler };