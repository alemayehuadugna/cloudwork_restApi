import { AggregateRoot } from "@/_lib/DDD";
import { TransactionId } from "./TransactionId";

namespace Transaction {
	type Status = 'Pending' | 'OnHold' | 'Cancelled' | 'Completed';
	type TxnType = 'Deposit' | 'Withdraw' | 'Transfer';

	type Transaction = AggregateRoot<TransactionId> & Readonly<{
		amount: number;
		status: Status;
		tnxFrom: string;
		tnxBy: {
			transferredThrough: string;
			accountNumber: string;
		};
		remark?: string;
		tnxTo: string;
		tnxType: TxnType;
		serviceCharge: number;
		tnxNumber: string;
		invoiceImageUrl: string;
		tnxTime: Date;
		updatedAt: Date;
		version: number;
	}>;

	type TransactionProps = Readonly<{
		id: TransactionId;
		amount: number;
		status: Status;
		tnxFrom: string;
		remark?: string;
		tnxTo: string;
		tnxType: TxnType;
		serviceCharge: number;
		tnxBy: {
			transferredThrough: string;
			accountNumber: string;
		};
		tnxNumber: string;
	}>;

	export const create = (props: TransactionProps): Transaction => ({
		...props,
		invoiceImageUrl: '',
		tnxTime: new Date(),
		updatedAt: new Date(),
		version: 0
	});

	export const markAsPending = (self: Transaction): Transaction => ({
		...self,
		status: 'Pending',
	});

	export const markAsOnHold = (self: Transaction): Transaction => ({
		...self,
		status: 'OnHold',
	});

	export const markAsCancelled = (self: Transaction): Transaction => ({
		...self,
		status: 'Cancelled',
	});

	export const markAsCompleted = (self: Transaction): Transaction => ({
		...self,
		status: 'Completed',
	});

	export const isCompleted = (self: Transaction): boolean => {
		return self.status === 'Completed';
	}

	export const isOnHold = (self: Transaction): boolean => {
		return self.status === 'OnHold';
	}

	export const isCancelled = (self: Transaction): boolean => {
		return self.status === 'Cancelled';
	}

	export type Type = Transaction;
}

export { Transaction };