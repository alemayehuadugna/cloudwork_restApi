
import { ChangeFreelancerPassword } from "@/freelancer/app/usecases/ChangeFreelancerPassword";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
	changeFreelancerPassword: ChangeFreelancerPassword;
}

const { getBody } = makeValidator({
	body: Joi.object({
		oldPassword: Joi.string().required(),
		newPassword: Joi.string().required(),
	}).required()
});

const changeFreelancerPasswordHandler = handler(
	({ changeFreelancerPassword }: Dependencies) =>
		async (req, res) => {
			let { oldPassword, newPassword } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const freelancerId: string = idObject.value;

			await changeFreelancerPassword({ oldPassword, newPassword, freelancerId });

			res.status(HttpStatus.OK).json();
		});

export { changeFreelancerPasswordHandler };