import { ListReview } from "@/review/app/usecase/ListReview"

import Joi from "types-joi";
import { HttpStatus } from '@/_lib/http/HttpStatus';
import { handler } from "@/_lib/http/handler";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { makePaginator } from "@/_lib/http/validation/Paginator";

type Dependencies = {
	listReview: ListReview;
}

const { getParams } = makeValidator({
	params: Joi.object({
		reviewedId: Joi.string().required(),
	}).required(),
});
const { getFilter, getPagination, getSorter } = makePaginator({
	
});

const listReviewHandler = handler(
	({ listReview }: Dependencies) =>
		async (req, res) => {
			const filter = getFilter(req);
			const pagination = getPagination(req);
			const sort = getSorter(req);
			const params = getParams(req);
			console.log("reviewedId: ", params.reviewedId);

			filter.reviewedId = params.reviewedId;

			const result = await listReview({
				filter,
				pagination,
				sort
			});

			res.status(HttpStatus.OK).json(result);
		}
)

export { listReviewHandler };