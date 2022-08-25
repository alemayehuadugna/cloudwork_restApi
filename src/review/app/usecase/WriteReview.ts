import { ReviewRepository } from "@/review/domain/ReviewRepository"
import { MessageBundle } from '@/messages';
import { ApplicationService } from "@/_lib/DDD";
import { Review } from "@/review/domain/Review";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
	reviewRepository: ReviewRepository;
	messageBundle: MessageBundle;
}

type WriteReviewDTO = Readonly<{
	jobId: string;
	reviewerId: string;
	reviewedId: string;
	title: string;
	comment: string;
	rate: number;
}>;

type WriteReview = ApplicationService<WriteReviewDTO, Review.Type>;

const makeWriteReview = ({ reviewRepository, messageBundle: { useBundle } }: Dependencies): WriteReview =>
	async (payload) => {

		const id = await reviewRepository.getNextId();

		const review = Review.create({
			id,
			jobId: payload.jobId,
			reviewerId: payload.reviewerId,
			reviewedId: payload.reviewedId,
			title: payload.title,
			comment: payload.comment,
			rate: payload.rate
		});

		const count = await reviewRepository.countById(payload.jobId, payload.reviewerId, payload.reviewedId);
		if (count == 0) {
			await reviewRepository.store(review);
		} else {
			throw BusinessError.create(
				useBundle("review.error.alreadyWritten", { id: payload.jobId })
			);
		}

		return review;
	}

export { makeWriteReview };
export type { WriteReview };