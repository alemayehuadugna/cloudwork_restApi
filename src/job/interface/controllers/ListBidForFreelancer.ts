import { ListBidForFreelancer } from "@/job/app/useCases/ListBidForFreelancer";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";
import { serializer } from "../serializers/serialize";
import { serializeForEmployee } from "../serializers/serializerForEmployees";

type Dependencies = {
	listBidForFreelancer: ListBidForFreelancer;
};

// const { getParams } = makeValidator({
// 	params: Joi.object({
// 		freelancerId: Joi.string().required(),
// 	}).required(),
// });

const { getFilter, getPagination, getSorter } = makePaginator({
	filter: Joi.object({
		progress: Joi.string().valid(
			"COMPLETED",
			"ACTIVE",
			"INACTIVE",
			"DELETED",
			"CANCELLED"
		),
	}),
});

const listBidForFreelancerHandler = handler(
	({ listBidForFreelancer }: Dependencies) =>
		async (req, res) => {
			// const { freelancerId } = getParams(req);
			const filter = getFilter(req);
			const pagination = getPagination(req);
			const sort = getSorter(req);
			const idObject: any = req.auth.credentials.uid;
			const freelancerId: string = idObject.value;

			const result = await listBidForFreelancer({
				freelancerId,
				filter,
				sort,
				pagination,
			});

			res.status(HttpStatus.OK).json({
				data: serializeForEmployee.serializeForEmployee(result.data),
				page: result.page,
			});
		}
);

export { listBidForFreelancerHandler };
