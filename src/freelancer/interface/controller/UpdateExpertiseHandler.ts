import { UpdateExpertise } from "@/freelancer/app/usecases/UpdateExpertise"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	updateExpertise: UpdateExpertise;
}

const { getBody } = makeValidator({
	body: Joi.object({
		expertise: Joi.string().min(3).required()
	}).required(),
});

const updateExpertiseHandler = handler(
	({ updateExpertise }: Dependencies) =>
		async (req, res) => {
			let { expertise } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const freelancerId = await updateExpertise({ expertise, id });

			res.status(HttpStatus.OK).json({ data: { freelancerId } })
		});

export { updateExpertiseHandler };