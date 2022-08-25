import { WriteReview } from "@/review/app/usecase/WriteReview";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from '@/_lib/http/validation/Validator';
import Joi from 'types-joi';

type Dependencies = {
	writeReview: WriteReview;
}

const { getBody } = makeValidator({
	body: Joi.object({
		jobId: Joi.string().required(),
		reviewerId: Joi.string().required(),
		reviewedId: Joi.string().required(),
		title: Joi.string().required(),
		comment: Joi.string().required(),
		rate: Joi.number().required(),
	}).required(),
});

const writeReviewHandler = handler(
	({ writeReview }: Dependencies) =>
		async (req, res) => {
			let { jobId, reviewerId, reviewedId, title, comment, rate } = getBody(req);

			const review = await writeReview({
				jobId,
				reviewedId,
				reviewerId,
				title,
				comment,
				rate
			});

			res.status(HttpStatus.CREATED).json(review);
		}
)

export { writeReviewHandler };