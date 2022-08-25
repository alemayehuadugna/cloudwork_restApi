import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Repository } from "@/_lib/DDD";
import { Review } from "./Review";

type ReviewRepository = Repository<Review.Type> & {
	findById(id: string): Promise<Review.Type>;
	find({
		pagination,
		filter,
		sort,
	}): Promise<PaginatedQueryResult<Review.Type[]>>;
	countById(jobId: string, reviewerId: string, reviewedId: string): Promise<number>;
}