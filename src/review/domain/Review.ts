import { AggregateRoot } from "@/_lib/DDD";
// import { makeWithInvariants } from "@/_lib/WithInvariants";
import { ReviewId } from "./ReviewId";

namespace Review {
	type Review = AggregateRoot<ReviewId> & Readonly<{
		jobId: string;
		reviewerId: string;
		reviewerInfo: any;
		reviewedId: string;
		title: string;
		comment: string;
		rate: number;
		createdAt: Date;
		updatedAt: Date;
	}>;

	type ReviewProps = Readonly<{
		id: ReviewId,
		jobId: string;
		reviewerId: string;
		reviewedId: string;
		title: string;
		comment: string;
		rate: number;
	}>;

	export const create = (props: ReviewProps): Review => ({
		...props,
		reviewerInfo: undefined,
		createdAt: new Date(),
		updatedAt: new Date(),
	});

	// const withInvariants = makeWithInvariants<Review>(function (self, assert) {
	// 	assert(self?.jobId.length > 0);
	// 	assert(self?.reviewedId.length > 0);
	// 	assert(self?.reviewerId.length > 0);
	// });

	export type Type = Review;
}

export { Review };