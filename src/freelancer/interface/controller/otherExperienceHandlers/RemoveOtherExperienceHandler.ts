import { RemoveOtherExperience } from "@/freelancer/app/usecases/otherExperience/RemoveOtherExperience";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	removeOtherExperience: RemoveOtherExperience;
}

const { getParams } = makeValidator({
	params: Joi.object({
		otherExperienceId: Joi.string().required(),
	}).required(),
});

const removeOtherExperienceHandler = handler(
	({ removeOtherExperience }: Dependencies) =>
		async (req, res) => {
			let { otherExperienceId } = getParams(req);
			const idObject: any = req.auth.credentials.uid;
			const freelancerId: string = idObject.value;

			await removeOtherExperience({ freelancerId, otherExperienceId });

			res.status(HttpStatus.NO_CONTENT).json();
		});

export { removeOtherExperienceHandler };