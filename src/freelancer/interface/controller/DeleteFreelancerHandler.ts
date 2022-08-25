import { DeleteFreelancer } from "@/freelancer/app/usecases/DeleteFreelancer";
import { DeleteFreelancerAdmin } from "@/freelancer/app/usecases/DeleteFreelancerAdmin";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
	deleteFreelancer: DeleteFreelancer;
	deleteFreelancerAdmin: DeleteFreelancerAdmin;
};

const { getBody } = makeValidator({
	body: Joi.object({
		reason: Joi.string(),
		password: Joi.string(),
		freelancerId: Joi.string(),
	}).required(),
});

const deleteFreelancerHandler = handler(
	({ deleteFreelancer, deleteFreelancerAdmin }: Dependencies) =>
		async (req, res) => {
			const { freelancerId, password, reason } = getBody(req);
			const params = req.params;
			const scope: string[] = req.auth.credentials.scope;
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			if (scope.includes("Admin") || scope.includes("Employee")) {
				console.log("freelancerId: ", params.freelancerId);
				await deleteFreelancerAdmin(params.freelancerId);
			} else {
				await deleteFreelancer({ id, reason, password: password! });
			}

			res.status(HttpStatus.NO_CONTENT).send();
		}
);

export { deleteFreelancerHandler };
