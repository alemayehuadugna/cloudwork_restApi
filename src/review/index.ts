import { makeModule } from "@/context";
import { ListReview, makeListReview } from "./app/usecase/ListReview";
import { makeWriteReview, WriteReview } from "./app/usecase/WriteReview";
import { ReviewRepository } from "./domain/ReviewRepository";
import { initReviewCollection, ReviewCollection } from "./infra/ReviewCollection"
import { withMongoProvider } from "@/_lib/MongoProvider";
import { reviewMessages } from "./messages";
import { toContainerValues } from "@/_lib/di/containerAdapters";
import { asFunction } from "awilix";
import { makeMongoReviewRepository } from "./infra/MongoReviewRepository";
import { makeReviewController } from "./interface/router";

type ReviewRegistry = {
	reviewCollection: ReviewCollection;
	reviewRepository: ReviewRepository;
	writeReview: WriteReview;
	listReview: ListReview;
};

const reviewModule = makeModule(
	'review',
	async ({
		container: { register, build},
		messageBundle: { updateBundle },
	}) => {
		const collections = await build(
			withMongoProvider({
				reviewCollection: initReviewCollection,
			})
		);

		updateBundle(reviewMessages);

		register({
			...toContainerValues(collections),
			reviewRepository: asFunction(makeMongoReviewRepository),
			writeReview: asFunction(makeWriteReview),
			listReview: asFunction(makeListReview),
		});

		build(makeReviewController);
	}
)

export { reviewModule };
export type { ReviewRegistry };