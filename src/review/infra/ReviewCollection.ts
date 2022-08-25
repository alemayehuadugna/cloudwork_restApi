import { Collection, Db } from "mongodb";
import { MUUID } from "uuid-mongodb"

type ReviewSchema = {
	_id: MUUID;
	jobId: MUUID;
	reviewerId: MUUID;
	reviewerInfo: any;
	reviewedId: MUUID;
	title: string;
	comment: string;
	rate: number;
	createdAt: Date;
	updatedAt: Date;
}

type ReviewCollection = Collection<ReviewSchema>;

const initReviewCollection = async (db: Db): Promise<ReviewCollection> => {
	const collection: ReviewCollection = db.collection('reviews');

	// await collection.createIndex({ _id: 1, jobId: 1; reviewerId: 1, })

	return collection;
};

export { initReviewCollection };
export type { ReviewSchema, ReviewCollection };