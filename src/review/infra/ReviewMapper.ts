import { DataMapper } from "@/_lib/DDD";
import { from } from "uuid-mongodb";
import { Review } from "../domain/Review";
import { ReviewSchema } from "./ReviewCollection";
import { ReviewIdProvider } from "./ReviewIdProvider";

const ReviewMapper: DataMapper<Review.Type, ReviewSchema> = {
	toDomainEntity: (ormEntity: ReviewSchema): Review.Type => ({
		id: ReviewIdProvider.create(from(ormEntity._id).toString()),
		jobId: from(ormEntity.jobId).toString(),
		reviewerInfo: ormEntity.reviewerInfo,
		reviewerId: from(ormEntity.reviewedId).toString(),
		reviewedId: from(ormEntity.reviewedId).toString(),
		title: ormEntity.title,
		comment: ormEntity.comment,
		rate: ormEntity.rate,

		createdAt: ormEntity.createdAt,
		updatedAt: ormEntity.updatedAt,
	}),
	toDomainEntities(ormEntities: any[]) {
		return ormEntities.map(e => this.toDomainEntity(e));
	},
	toOrmEntity: (domainEntity: Review.Type) => ({
		_id: from(domainEntity.id.value),
		jobId: from(domainEntity.jobId),
		reviewerId: from(domainEntity.reviewerId),
		reviewerInfo: domainEntity.reviewerInfo,
		reviewedId: from(domainEntity.reviewedId),
		title: domainEntity.title,
		comment: domainEntity.comment,
		rate: domainEntity.rate,
		createdAt: domainEntity.createdAt,
		updatedAt: domainEntity.updatedAt
	}),
	toOrmEntities(domainEntities: Review.Type[]) {
		return domainEntities.map(e => this.toOrmEntity(e));
	}
}

export { ReviewMapper }