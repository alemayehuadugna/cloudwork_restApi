import { DataMapper } from "@/_lib/DDD";
import { from } from "uuid-mongodb";
import { Feedback } from "../domain/Feedback";
import { FeedbackSchema } from "./FeedbackCollection";
import { FeedbackIdProvider } from "./FeedbackIdProvider";

const FeedbackMapper : DataMapper<Feedback.Type, FeedbackSchema> = {
    toOrmEntity: (domainEntity: Feedback.Type) => ({
        _id: from(domainEntity.id.value),
        firstName: domainEntity.firstName,
        lastName: domainEntity.lastName,
        message: domainEntity.message,
        title: domainEntity.title,
        status: domainEntity.state,
        deleted: domainEntity.state === 'DELETED',
        createdAt: domainEntity.createdAt,
        updatedAt: domainEntity.updatedAt
    }),

    toOrmEntities: function(ormEntities: Feedback.Type[]){
        return ormEntities.map(entity => this.toOrmEntity(entity));
    },

    toDomainEntity: (ormEntities: FeedbackSchema) => ({
        id: FeedbackIdProvider.create(from(ormEntities._id).toString()),
        firstName: ormEntities.firstName,
        lastName: ormEntities.lastName,
        message: ormEntities.message,
        title: ormEntities.title,
        state: ormEntities.status,
        createdAt: ormEntities.createdAt,
        updatedAt: ormEntities.updatedAt
    }),

    toDomainEntities: function(ormEntities: any[]) {
        return ormEntities.map(entity => this.toDomainEntity(entity));
    }
};

export {FeedbackMapper}