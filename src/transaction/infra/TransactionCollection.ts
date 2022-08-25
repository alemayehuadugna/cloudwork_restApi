import { Collection, Db } from "mongodb";
import { MUUID } from "uuid-mongodb"

type TransactionSchema = {
	_id: MUUID;
	amount: number;
	status: 'Pending' | 'OnHold' | 'Cancelled' | 'Completed';
	tnxFrom: string;
	tnxBy: {
		transferredThrough: string,
		accountNumber: string,
	};
	remark?: string;
	tnxTo: string;
	tnxType: 'Deposit' | 'Withdraw' | 'Transfer';
	serviceCharge: number;
	tnxNumber: string;
	invoiceImageUrl: string;
	tnxTime: Date;
	updatedAt: Date;
	version: number;
}

type TransactionCollection = Collection<TransactionSchema>;

const initTransactionCollection = async (db: Db): Promise<TransactionCollection> => {
	const collection: TransactionCollection = db.collection('transactions');

	return collection;
}

export { initTransactionCollection };
export type { TransactionSchema, TransactionCollection };