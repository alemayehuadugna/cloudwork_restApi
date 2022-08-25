import { MessageBundle } from "@/messages";
import { TransactionRepository } from "@/transaction/domain/TransactionRepository"
import { WalletRepository } from "@/wallet/domain/WalletRepository";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import { Transaction } from '../../domain/Transaction';

type Dependencies = {
	transactionRepository: TransactionRepository;
	walletRepository: WalletRepository;
	messageBundle: MessageBundle;
}

type DepositTransactionDTO = Readonly<{
	amount: number;
	tnxFrom: string;
	tnxBy: {
		transferredThrough: string,
		accountNumber: string,
	};
	remark?: string;
	tnxNumber: string;
}>;

type DepositTransaction = ApplicationService<DepositTransactionDTO, Transaction.Type>;

const makeDepositTransaction = ({ transactionRepository, walletRepository, messageBundle: { useBundle } }: Dependencies): DepositTransaction =>
	async (payload) => {
		let userWallet = await walletRepository.findByUserId(payload.tnxFrom);

		if (!userWallet) {
			throw BusinessError.create(
				useBundle('wallet.error.notFound', { id: payload.tnxFrom })
			);
		}

		const id = await transactionRepository.getNextId();
		const transaction = Transaction.create({
			id,
			amount: payload.amount,
			status: "Pending",
			tnxFrom: payload.tnxFrom,
			remark: payload.remark,
			tnxTo: "CloudWork",
			tnxType: "Deposit",
			serviceCharge: 0.0,
			tnxBy: payload.tnxBy,
			tnxNumber: payload.tnxFrom,
		});

		await transactionRepository.store(transaction);

		return transaction;
	}

export { makeDepositTransaction };
export type { DepositTransaction };


