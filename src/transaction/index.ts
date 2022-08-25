import { ApproveTransaction, makeApproveTransaction } from "./app/usecases/ApproveTransaction";
import { CancelTransaction, makeCancelTransaction } from "./app/usecases/CancelTransaction";
import { DepositTransaction, makeDepositTransaction } from "./app/usecases/DepositTransaction";
import { HoldTransaction, makeHoldTransaction } from "./app/usecases/HoldTransaction";
import { ListTransaction, makeListTransaction } from "./app/usecases/ListTransactions";
import { makeWithdrawTransaction, WithdrawTransaction } from "./app/usecases/WithdrawTransaction";
import { TransactionRepository } from "./domain/TransactionRepository";
import { initTransactionCollection, TransactionCollection } from "./infra/TransactionCollection"
import { makeModule } from '@/context';
import { withMongoProvider } from "@/_lib/MongoProvider";
import { transactionMessages } from "./messages";
import { toContainerValues } from "@/_lib/di/containerAdapters";
import { asFunction } from "awilix";
import { makeMongoTransactionRepository } from "./infra/TransactionRepositoryImpl";
import { makeTransactionController } from "./interface/router";
import { DepositWithChapa, makeDepositWithChapa } from "./app/usecases/DepositWithChapa";
import { makeVerifyChapaListener } from "./interface/listener/VerifyChapaListener";
import { makeVerifyChapaTransaction, VerifyChapaTransaction } from "./app/usecases/VeirfyChapa";

type TransactionRegistry = {
	transactionCollection: TransactionCollection;
	transactionRepository: TransactionRepository;
	approveTransaction: ApproveTransaction;
	cancelTransaction: CancelTransaction;
	depositTransaction: DepositTransaction;
	holdTransaction: HoldTransaction;
	listTransaction: ListTransaction;
	withdrawTransaction: WithdrawTransaction;
	depositWithChapa: DepositWithChapa;
	verifyChapaTransaction: VerifyChapaTransaction;
};

const transactionModule = makeModule(
	'transaction',
	async ({
		container: { register, build },
		messageBundle: { updateBundle },
	}) => {
		const collections = await build(
			withMongoProvider({
				transactionCollection: initTransactionCollection,
			})
		);

		updateBundle(transactionMessages);

		register({
			...toContainerValues(collections),
			transactionRepository: asFunction(makeMongoTransactionRepository),
			approveTransaction: asFunction(makeApproveTransaction),
			cancelTransaction: asFunction(makeCancelTransaction),
			depositTransaction: asFunction(makeDepositTransaction),
			holdTransaction: asFunction(makeHoldTransaction),
			listTransaction: asFunction(makeListTransaction),
			withdrawTransaction: asFunction(makeWithdrawTransaction),
			depositWithChapa: asFunction(makeDepositWithChapa),
			verifyChapaTransaction: asFunction(makeVerifyChapaTransaction),
		});

		build(makeTransactionController);
		build(makeVerifyChapaListener);
	}
)

export { transactionModule };
export type { TransactionRegistry };