import { GetFreelancer } from "@/freelancer/app/usecases/GetFreelancer";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from "types-joi";
import { serializer } from "../serializers/serializeForFreelancer";
import { serializerForEmployee } from "../serializers/serializeForEmployees";
import { serializerForClient } from "../serializers/serializerForClient";

type Dependencies = {
	getFreelancer: GetFreelancer;
};

const { getParams } = makeValidator({
	params: Joi.object({
		freelancerId: Joi.string().required(),
	}).required(),
});

const getFreelancerHandler = function (forWhom, type) {
	return handler(
		({ getFreelancer }: Dependencies) =>
			async (req: Request, res: Response) => {


				let data, freelancerId, freelancer;
				const scope: String[] = req.auth.credentials.scope;
				if (scope != undefined && scope.includes('Client')) {
					freelancerId = getParams(req);
					console.log("freelancerId: ", freelancerId.freelancerId);
					freelancer = await getFreelancer(freelancerId.freelancerId);
					data = serializerForClient.serializeForClient(freelancer);
				} else if (forWhom === 'Employee') {
					freelancerId = getParams(req);
					freelancer = await getFreelancer(freelancerId.value);
					data = serializerForEmployee.serializeForEmployee(freelancer)
				} else if (forWhom === 'Freelancer') {
					freelancerId = req.auth.credentials.uid;
					freelancer = await getFreelancer(freelancerId.value);
					data = serializer.serializeForFreelancer(
						freelancer, type === 'Detail' ? 'Detail' : 'Basic'
					);
				}
				res.status(HttpStatus.OK).json({ data: data });
			}
	);
}

export { getFreelancerHandler };
