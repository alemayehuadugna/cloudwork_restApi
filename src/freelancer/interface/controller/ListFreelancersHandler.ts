import { ListFreelancer } from "@/freelancer/app/usecases/ListFreelancer";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import { serializerForEmployee } from "../serializers/serializeForEmployees";
import { serializerForClient } from "../serializers/serializerForClient";
import Joi from "types-joi";


type Dependencies = {
	listFreelancer: ListFreelancer;
};

const { getFilter, getPagination, getSorter } = makePaginator({
	filter: Joi.object({
		gender: Joi.string().valid("Male", "Female"),
		joinedBetween: Joi.array().items(Joi.date().iso().required()).min(2).max(2),
		expertise: Joi.string(),
		verified: Joi.boolean(),
	}),
});

const listFreelancerHandler = handler(
	({ listFreelancer }: Dependencies) =>
		async (req, res) => {
			const filter = getFilter(req);
			const pagination = getPagination(req);
			const sort = getSorter(req);
			const scope: String[] = req.auth.credentials.scope;
			console.log("user scope: ", req.auth.credentials);
			const result = await listFreelancer({
				filter,
				pagination,
				sort,
			});
			if (scope.includes('Employee')) {
				res.status(HttpStatus.OK).json({
					data: serializerForEmployee.serializeForEmployee(result.data),
					page: result.page
				});
			} else if (scope.includes('Client')) {
				res.status(HttpStatus.OK).json({
					data: serializerForClient.serializeForClient(result.data),
					page: result.page
				});
			} else {
				res.status(HttpStatus.NO_CONTENT).json();
			}

		}
);

export { listFreelancerHandler };
