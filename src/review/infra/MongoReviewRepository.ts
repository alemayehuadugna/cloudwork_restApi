import { from, v4 } from "uuid-mongodb";
import { Review } from "../domain/Review";
import { ReviewRepository } from "../domain/ReviewRepository";
import { ReviewCollection, ReviewSchema } from "./ReviewCollection"
import { ReviewIdProvider } from "./ReviewIdProvider";
import { ReviewMapper } from "./ReviewMapper";
import { PaginatedQueryResult } from '@/_lib/CQRS';
import { Filter } from "mongodb";
import { match } from "assert";

type Dependencies = {
	reviewCollection: ReviewCollection;
}

const makeMongoReviewRepository = ({ reviewCollection }: Dependencies): ReviewRepository => ({
	async find({ pagination, filter, sort, }): Promise<PaginatedQueryResult<Review.Type[]>> {
		let match: Filter<ReviewSchema> = {

		}

		if (filter.reviewedId) {
			match = {
				...match,
				reviewedId: from(filter.reviewedId)
			}
		}

		const reviews = await reviewCollection
			.aggregate([
				{
					$match: match,
				},
				{
					$skip:
						Math.max(pagination.page - 1, 0) * pagination.pageSize,
				},
				{
					$limit: pagination.pageSize,
				},
				...(sort?.length
					? [
						{
							$sort: sort.reduce(
								(acc, { field, direction }) => ({
									[field]: direction === "asc" ? 1 : -1,
								}),
								{}
							),
						},
					]
					: []),

			]).toArray();

		const totalElements = await reviewCollection.countDocuments(match);

		const totalPages = Math.ceil(totalElements / pagination.pageSize);

		return {
			data: ReviewMapper.toDomainEntities(reviews),
			page: {
				totalPages,
				pageSize: pagination.pageSize,
				totalElements,
				current: pagination.page,
				first: pagination.page === 1,
				last: pagination.page === totalPages,
			}
		}

	},
	async findById(id: string): Promise<Review.Type> {
		const review = await reviewCollection.findOne({
			jobId: from(id)
		});

		if (!review) {
			throw new Error('Review not found');
		}

		return ReviewMapper.toDomainEntity(review);
	},
	async countById(jobId: string, reviewerId: string, reviewedId: string) {
		const count = await reviewCollection.countDocuments({
			jobId: from(jobId),
			reviewedId: from(reviewedId),
			reviewerId: from(reviewerId),
		});

		return count;
	},
	async store(entity) {
		ReviewIdProvider.validate(entity.id);

		const { _id, ...data } = ReviewMapper.toOrmEntity(entity);

		const count = await reviewCollection.countDocuments({ _id });

		if (count) {
			await reviewCollection.updateOne(
				{ _id },
				{
					$set: {
						...data,
						updatedAt: new Date(),
					}
				}
			);
			return;
		}

		await reviewCollection.insertOne({
			_id,
			...data
		});
	},
	async getNextId() {
		return Promise.resolve(ReviewIdProvider.create(v4().toString()));
	},

});

export { makeMongoReviewRepository };