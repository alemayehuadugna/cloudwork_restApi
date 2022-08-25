import { Review } from "@/review/domain/Review";
import { ReviewRepository } from "@/review/domain/ReviewRepository"
import { QueryHandler, SortedPaginatedQuery, PaginatedQueryResult } from '@/_lib/CQRS';

type Dependencies = {
	reviewRepository: ReviewRepository;
}

type ReviewFilter = {
	reviewedId: string;
};

type ListReview = QueryHandler<
	SortedPaginatedQuery<ReviewFilter>,
	PaginatedQueryResult<Review.Type[]>
>;

const makeListReview = ({ reviewRepository }: Dependencies): ListReview =>
	async (payload) => {
		const { pagination, filter, sort } = payload;
		return await reviewRepository.find({
			pagination,
			filter,
			sort
		});
	};

export { makeListReview };
export type { ListReview };