import { SearchFreelancer } from "@/freelancer/app/usecases/SearchFreelancer"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import Joi from "types-joi";
import { serializerForEmployee } from "../serializers/serializeForEmployees";

type Dependencies = {
	searchFreelancer: SearchFreelancer;
}

const { getFilter, getPagination } = makePaginator({
	filter: Joi.object({
		searchItem: Joi.string()
	}),
});

const searchFreelancerHandler = handler(({ searchFreelancer }: Dependencies) =>
	async (req, res) => {
		const pagination = getPagination(req);
		const filter = getFilter(req);
		console.log('searchItem in controller: ', filter);
		
		const result = await searchFreelancer({
			pagination, filter
		});

		res.status(HttpStatus.OK).json({
			data: serializerForEmployee.serializeForEmployee(result.data),
			page: result.page
		});
	});

export { searchFreelancerHandler };