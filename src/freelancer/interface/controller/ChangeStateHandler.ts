import { ChangeFreelancerState } from "@/freelancer/app/usecases/ChangeState"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
	changeFreelancerState: ChangeFreelancerState;
}

const { getBody, getParams } = makeValidator({
	params: Joi.object({
		freelancerId: Joi.string().required(),
	}).required(),
	body: Joi.object({
		state: Joi.string().valid('ACTIVE', 'DEACTIVATED').required()
	}).required()
});

const changeFreelancerStateHandler = handler(({ changeFreelancerState }: Dependencies) =>
	async (req, res) => {
		const { freelancerId } = getParams(req);
		var { state } = getBody(req);

		var temp: "ACTIVE" | "DEACTIVATED";
		if (state === 'ACTIVE') {
			temp = 'ACTIVE';
		} else {
			temp = 'DEACTIVATED';
		}

		await changeFreelancerState({ freelancerId, state: temp });

		res.status(HttpStatus.OK).send();
	});

export { changeFreelancerStateHandler };