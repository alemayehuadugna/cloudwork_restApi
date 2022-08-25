import { DataMapper } from "@/_lib/DDD";
import { from } from "uuid-mongodb";
import { Milestone } from "../domain/Milestone";
import { MilestoneSchema } from "./MilestoneCollection";
import { MilestoneIdProvider } from "./MilestoneIdProvider";

const MilestoneMapper: DataMapper<Milestone.Type, MilestoneSchema> = {
	toOrmEntity: (domainEntity: Milestone.Type) => ({
		_id: from(domainEntity.id.value),
        Name: domainEntity.Name,
        Budget: domainEntity.Budget,
        Progress: domainEntity.Progress,
        Paid:  domainEntity.Paid,
		state: domainEntity.state,
        deleted: domainEntity.state === 'DELETED',
        // createdAt: domainEntity.createdAt,
        // updatedAt: domainEntity.updatedAt,
        StartDate: domainEntity.StartDate,
        EndDate: domainEntity.EndDate,
		version: domainEntity.version,
	}),
	toOrmEntities: function (ormEntities: Milestone.Type[]) {
		return ormEntities.map( entity => this.toOrmEntity(entity));
	},
	toDomainEntity: (domainEntity: MilestoneSchema) => ({
		id: MilestoneIdProvider.create(from(domainEntity._id).toString()),
		Name: domainEntity.Name,
        Budget: domainEntity.Budget,
        Progress: domainEntity.Progress,
        Paid:  domainEntity.Paid,
		state: domainEntity.state,
        deleted: domainEntity.state === 'DELETED',
        // createdAt: domainEntity.createdAt,
        // updatedAt: domainEntity.updatedAt,
        StartDate: domainEntity.StartDate,
        EndDate: domainEntity.EndDate,
		version: domainEntity.version,
	}),
	toDomainEntities: function (domainEntities: any[]) {
		return domainEntities.map( entity => this.toDomainEntity(entity));
	}
};

export { MilestoneMapper };
