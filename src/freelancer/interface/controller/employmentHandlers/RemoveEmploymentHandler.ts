
import { RemoveEmployment } from "@/freelancer/app/usecases/employment/RemoveEmployment";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	removeEmployment: RemoveEmployment;
}

const { getParams } = makeValidator({
	params: Joi.object({
		employmentId: Joi.string().required(),
	}).required(),
});

const removeEmploymentHandler = handler(
	({ removeEmployment }: Dependencies) =>
		async (req, res) => {
			let { employmentId } = getParams(req);
			const idObject: any = req.auth.credentials.uid;
			const freelancerId: string = idObject.value;

			await removeEmployment({ freelancerId, employmentId });

			res.status(HttpStatus.NO_CONTENT).json();
		});

export { removeEmploymentHandler };