import { DataMapper } from "@/_lib/DDD";
import { from } from "uuid-mongodb";
import { Transaction } from "../domain/Transaction";
import { TransactionSchema } from "./TransactionCollection";
import { TransactionIdProvider } from "./TransactionIdProvider";

const TransactionMapper: DataMapper<Transaction.Type, TransactionSchema> = {
	toDomainEntity: (ormEntity: TransactionSchema) => ({
		id: TransactionIdProvider.create(from(ormEntity._id).toString()),
		amount: ormEntity.amount,
		status: ormEntity.status,
		tnxFrom: ormEntity.tnxFrom,
		tnxBy: ormEntity.tnxBy,
		remark: ormEntity.remark,
		tnxTo: ormEntity.tnxTo,
		tnxType: ormEntity.tnxType,
		serviceCharge: ormEntity.serviceCharge,
		tnxNumber: ormEntity.tnxNumber,
		invoiceImageUrl: ormEntity.invoiceImageUrl,
		tnxTime: ormEntity.tnxTime,
		updatedAt: ormEntity.updatedAt,
		version: ormEntity.version,
	}),
	toDomainEntities(ormEntities) {
		return ormEntities.map(e => this.toDomainEntity(e));
	},
	toOrmEntity: (domainEntity) => ({
		_id: from(domainEntity.id.value),
		amount: domainEntity.amount,
		status: domainEntity.status,
		tnxFrom: domainEntity.tnxFrom,
		tnxBy: domainEntity.tnxBy,
		remark: domainEntity.remark,
		tnxTo: domainEntity.tnxTo,
		tnxType: domainEntity.tnxType,
		serviceCharge: domainEntity.serviceCharge,
		tnxNumber: domainEntity.tnxNumber,
		invoiceImageUrl: domainEntity.invoiceImageUrl,
		tnxTime: domainEntity.tnxTime,
		updatedAt: domainEntity.updatedAt,
		version: domainEntity.version,
	}),
	toOrmEntities(domainEntities) {
		return domainEntities.map(e => this.toOrmEntity(e));
	},
}

export { TransactionMapper };