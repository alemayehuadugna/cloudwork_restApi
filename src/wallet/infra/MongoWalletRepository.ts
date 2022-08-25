import { v4, from } from 'uuid-mongodb';
import { Wallet } from "../domain/Wallet";
import { WalletId } from "../domain/WalletId";
import { WalletRepository } from "../domain/WalletRepository";
import { WalletCollection } from "./WalletCollection"
import { WalletIdProvider } from "./WalletIdProvider";
import { WalletMapper } from './WalletMapper';

type Dependencies = {
	walletCollection: WalletCollection;
};

const makeMongoWalletRepository = ({ walletCollection }: Dependencies): WalletRepository => ({
	async getNextId(): Promise<WalletId> {
		return Promise.resolve(WalletIdProvider.create(v4().toString()));
	},
	async findById(id: string): Promise<Wallet.Type> {
		const wallet = await walletCollection.findOne({ _id: from(id) });

		if (!wallet) {
			throw new Error('Wallet not found');
		}

		return WalletMapper.toDomainEntity(wallet);
	},
	async findByUserId(userId: string): Promise<Wallet.Type> {
		const wallet = await walletCollection.findOne({ userId: userId});

		if (!wallet) {
			throw new Error('Wallet not found');
		}

		return WalletMapper.toDomainEntity(wallet);
	},
	async store(entity: Wallet.Type): Promise<void> {
		WalletIdProvider.validate(entity.id);

		const { _id, version, ...data } = WalletMapper.toOrmEntity(entity);

		const count = await walletCollection.countDocuments({ _id });

		if (count) {
			await walletCollection.updateOne(
				{ _id, version },
				{
					$set: {
						...data,
						updatedAt: new Date(),
						version: version + 1,
					}
				}
			);
			return;
		}

		await walletCollection.insertOne({
			_id,
			...data,
			version,
		})
	},
});

export { makeMongoWalletRepository };