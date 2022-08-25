import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Repository } from "@/_lib/DDD";
import { Transaction } from "./Transaction";

type ChapaDepositParams = {
	amount: Number;
	currency: string;
	email: string;
	firstName: string;
	lastName: string;
	tx_ref: string;
}

type TransactionRepository = Repository<Transaction.Type> & {
	findById(id: string): Promise<Transaction.Type>;
	find({ pagination, filter, sort }): Promise<PaginatedQueryResult<Transaction.Type[]>>;
	depositWithChapa({ amount, currency, email, firstName, lastName, tx_ref }: ChapaDepositParams): Promise<string>;
}