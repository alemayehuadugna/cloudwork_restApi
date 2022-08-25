import { Collection, Db } from "mongodb";
import { MUUID } from "uuid-mongodb"

type WalletSchema = {
	_id: MUUID;
	userId: string;
	balance: number;
	invested: number;
	inTransaction: number;
	createdAt: Date;
	updatedAt: Date;
	version: number;
}

type WalletCollection = Collection<WalletSchema>;

const initWalletCollection = async (db: Db): Promise<WalletCollection> => {
	const collection: WalletCollection = db.collection('wallets');

	await collection.createIndex({ _id: 1, userId: 1 });

	return collection;
};

export { initWalletCollection };
export type { WalletSchema, WalletCollection };