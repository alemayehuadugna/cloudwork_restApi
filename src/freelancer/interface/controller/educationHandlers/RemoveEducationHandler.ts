import { RemoveEducation } from "@/freelancer/app/usecases/education/RemoveEducation";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	removeEducation: RemoveEducation;
}

const { getParams } = makeValidator({
	params: Joi.object({
		educationId: Joi.string().required(),
	}).required(),
});

const removeEducationHandler = handler(
	({ removeEducation }: Dependencies) =>
		async (req, res) => {
			let { educationId } = getParams(req);
			const idObject: any = req.auth.credentials.uid;
			const freelancerId: string = idObject.value;

			await removeEducation({ freelancerId, educationId });

			res.status(HttpStatus.NO_CONTENT).json();
		});

export { removeEducationHandler };