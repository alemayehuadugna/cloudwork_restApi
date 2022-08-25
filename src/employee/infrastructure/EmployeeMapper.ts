import { DataMapper } from "@/_lib/DDD";
import { from } from "uuid-mongodb";
import { Employee } from "../domain/Employee";
import { EmployeeSchema } from "./EmployeeCollection";
import { EmployeeIdProvider } from "./EmployeeIdProvider";

const EmployeeMapper: DataMapper<Employee.Type, EmployeeSchema> = {
	toOrmEntity: (domainEntity: Employee.Type) => ({
		_id: from(domainEntity.id.value),
		firstName: domainEntity.firstName,
		lastName: domainEntity.lastName,
		phone: domainEntity.phone,
		email: domainEntity.email,
		password: domainEntity.password,
		gender: domainEntity.gender,
		roles: domainEntity.roles,
		state: domainEntity.state,
		deleted: domainEntity.state === "DELETED",
		createdAt: domainEntity.createdAt,
		updatedAt: domainEntity.updatedAt,
		version: domainEntity.version,
	}),
	toOrmEntities: function (ormEntities: Employee.Type[]) {
		return ormEntities.map((entity) => this.toOrmEntity(entity));
	},
	toDomainEntity: (domainEntity: EmployeeSchema) => ({
		id: EmployeeIdProvider.create(from(domainEntity._id).toString()),
		firstName: domainEntity.firstName,
		lastName: domainEntity.lastName,
		phone: domainEntity.phone,
		email: domainEntity.email,
		password: domainEntity.password,
		gender: domainEntity.gender,
		roles: domainEntity.roles,
		state: domainEntity.state,
		deleted: domainEntity.deleted,
		createdAt: domainEntity.createdAt,
		updatedAt: domainEntity.updatedAt,
		version: domainEntity.version,
	}),
	toDomainEntities: function (domainEntities: any[]) {
		return domainEntities.map((entity) => {
			return this.toDomainEntity(entity);
		});
	},
};

export { EmployeeMapper };
