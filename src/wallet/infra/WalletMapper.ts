import { DataMapper } from '@/_lib/DDD';
import { Wallet } from '../domain/Wallet';
import { WalletSchema } from './WalletCollection';
import { from } from 'uuid-mongodb';
import { WalletIdProvider } from './WalletIdProvider';


const WalletMapper: DataMapper<Wallet.Type, WalletSchema> = {
	toDomainEntity: (ormEntity: WalletSchema) => ({
		id: WalletIdProvider.create(from(ormEntity._id).toString()),
		userId: ormEntity.userId,
		balance: ormEntity.balance,
		invested: ormEntity.invested,
		inTransaction: ormEntity.inTransaction,
		createdAt: ormEntity.createdAt,
		updatedAt: ormEntity.updatedAt,
		version: ormEntity.version,
	}),
	toDomainEntities(ormEntities: any[]) {
		return ormEntities.map(e => this.toDomainEntity(e));
	},
	toOrmEntity: (domainEntity: Wallet.Type) => ({
		_id: from(domainEntity.id.value),
		userId: domainEntity.userId,
		balance: domainEntity.balance,
		invested: domainEntity.invested,
		inTransaction: domainEntity.inTransaction,
		createdAt: domainEntity.createdAt,
		updatedAt: domainEntity.updatedAt,
		version: domainEntity.version,
	}),
	toOrmEntities(domainEntities: Wallet.Type[]) {
		return domainEntities.map(e => this.toOrmEntity(e));
	},
};

export { WalletMapper };