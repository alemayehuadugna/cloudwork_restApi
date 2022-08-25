import { VerifyFreelancer } from "@/freelancer/app/usecases/VerifyFreelancer";
import { handler } from "@/_lib/http/handler";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
	verifyFreelancer: VerifyFreelancer;
}

const { getParams } = makeValidator({
	params: Joi.object({
		freelancerId: Joi.string().required(),
	}).required()
});

const verifyFreelancerHandler = handler(
	({ verifyFreelancer }: Dependencies) =>
		async (req, res) => {
			const { freelancerId } = getParams(req);

			await verifyFreelancer(freelancerId);

			res.status(HttpStatus.OK).json({ freelancerId: freelancerId });
		}
)

export { verifyFreelancerHandler };