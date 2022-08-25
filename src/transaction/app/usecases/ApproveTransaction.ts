import { MessageBundle } from "@/messages";
import { Transaction } from "@/transaction/domain/Transaction";
import { TransactionRepository } from "@/transaction/domain/TransactionRepository";
import { Wallet } from "@/wallet/domain/Wallet";
import { WalletRepository } from "@/wallet/domain/WalletRepository";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import { Logger } from 'pino';

type Dependencies = {
	transactionRepository: TransactionRepository;
	walletRepository: WalletRepository;
	messageBundle: MessageBundle;
	logger: Logger;
}

type ApproveTransaction = ApplicationService<string, Transaction.Type>;

const makeApproveTransaction = ({ transactionRepository, walletRepository, logger, messageBundle: { getMessage, useBundle } }: Dependencies): ApproveTransaction =>
	async (payload) => {
		const transaction = await transactionRepository.findById(payload);

		if (Transaction.isCompleted(transaction)) {
			throw BusinessError.create(
				useBundle('transaction.error.alreadyCompleted', { id: payload })
			);
		}

		if (transaction.tnxType === 'Deposit') {
			const userWallet = await walletRepository.findByUserId(transaction.tnxFrom);
			if (!userWallet) {
				throw BusinessError.create(useBundle('wallet.error.notFound', { id: transaction.tnxFrom }));
			}
			const updatedWallet = Wallet.deposit(userWallet, transaction.amount);
			await walletRepository.store(updatedWallet);

		} else if (transaction.tnxType === 'Withdraw') {
			const userWallet = await walletRepository.findByUserId(transaction.tnxTo);
			if (!userWallet) {
				throw BusinessError.create(useBundle('wallet.error.notFound', { id: transaction.tnxTo }));
			}
			const updatedWallet = Wallet.completeWithdraw(userWallet, transaction.amount);
			await walletRepository.store(updatedWallet);
		} else {
			logger.error("Trying to Complete 'Transfer' type Transaction error");
			throw Error("Trying to Complete 'Transfer' type Transaction error");
		}

		const completedTransaction = Transaction.markAsCompleted(transaction);
		await transactionRepository.store(completedTransaction);

		logger.info(
			getMessage('transaction.completed', { id: transaction.id.value, completedAt: new Date() })
		);

		return completedTransaction;
	}

export { makeApproveTransaction };
export type { ApproveTransaction };