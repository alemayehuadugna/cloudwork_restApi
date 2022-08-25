import { MessageBundle } from "@/messages";
import { Transaction } from "@/transaction/domain/Transaction";
import { TransactionRepository } from "@/transaction/domain/TransactionRepository";
import { Wallet } from "@/wallet/domain/Wallet";
import { WalletRepository } from "@/wallet/domain/WalletRepository";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
	transactionRepository: TransactionRepository;
	walletRepository: WalletRepository;
	messageBundle: MessageBundle;
}

type WithdrawTransactionDTO = Readonly<{
	amount: number;
	tnxTo: string;
	tnxBy: {
		transferredThrough: string,
		accountNumber: string,
	};
	remark?: string;
}>;

type WithdrawTransaction = ApplicationService<WithdrawTransactionDTO, Transaction.Type>;

const makeWithdrawTransaction = ({ transactionRepository, walletRepository, messageBundle: { useBundle } }: Dependencies): WithdrawTransaction =>
	async (payload) => {
		const userWallet = await walletRepository.findByUserId(payload.tnxTo);

		if (!userWallet) {
			throw BusinessError.create(
				useBundle('wallet.error.notFound', { id: payload.tnxTo })
			);
		}

		if (payload.amount > userWallet.balance) {
			throw BusinessError.create(
				useBundle('wallet.error.insufficientBalance')
			);
		}

		// withdraw money and add it to inTransaction
		const updatedWallet = Wallet.withdraw(userWallet, payload.amount);

		const id = await transactionRepository.getNextId();
		const transaction = Transaction.create({
			id,
			amount: payload.amount,
			status: "Pending",
			tnxFrom: "CloudWork",
			remark: payload.remark,
			tnxTo: payload.tnxTo,
			tnxType: "Withdraw",
			serviceCharge: 0.0,
			tnxBy: payload.tnxBy,
			tnxNumber: "",
		});

		await walletRepository.store(updatedWallet);
		await transactionRepository.store(transaction);

		return transaction;
	}

export { makeWithdrawTransaction };
export type { WithdrawTransaction };