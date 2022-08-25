import { Transaction } from "@/transaction/domain/Transaction";
import { TransactionRepository } from "@/transaction/domain/TransactionRepository";
import { PaginatedQueryResult, QueryHandler, SortedPaginatedQuery } from "@/_lib/CQRS";

type Dependencies = {
	transactionRepository: TransactionRepository;
}

type TransactionFilter = {
	status: string;
	tnxBy: string;
	tnxType: string;
	amountRange: { start: number; end: number; }
}

type ListTransaction = QueryHandler<
	SortedPaginatedQuery<TransactionFilter>,
	PaginatedQueryResult<Transaction.Type[]>
>;

const makeListTransaction =
	({ transactionRepository }: Dependencies): ListTransaction =>
		async (payload) => {
			const { pagination, filter, sort } = payload;
			return await transactionRepository.find({
				pagination,
				filter,
				sort
			});
		};

export { makeListTransaction };
export type { ListTransaction };