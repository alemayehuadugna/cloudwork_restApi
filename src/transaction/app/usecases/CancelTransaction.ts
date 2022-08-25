import { TransactionRepository } from "@/transaction/domain/TransactionRepository";
import { WalletRepository } from "@/wallet/domain/WalletRepository";
import { MessageBundle } from '@/messages';
import { Logger } from 'pino';
import { ApplicationService } from "@/_lib/DDD";
import { Transaction } from "@/transaction/domain/Transaction";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import { Wallet } from "@/wallet/domain/Wallet";

type Dependencies = {
	transactionRepository: TransactionRepository;
	walletRepository: WalletRepository;
	messageBundle: MessageBundle;
	logger: Logger;
}

type CancelTransaction = ApplicationService<string, Transaction.Type>;

const makeCancelTransaction = ({ transactionRepository, walletRepository, logger, messageBundle: { getMessage, useBundle } }: Dependencies): CancelTransaction =>
	async (payload) => {
		const transaction = await transactionRepository.findById(payload);

		if (Transaction.isCancelled(transaction)) {
			throw BusinessError.create(
				useBundle('transaction.error.alreadyCancelled', { id: payload })
			);
		}

		
		if (Transaction.isCompleted(transaction)) {
			throw BusinessError.create(
				useBundle('transaction.error.already.Completed', { id: payload })
			);
		}

		if (transaction.tnxType === 'Withdraw') {
			const userWallet = await walletRepository.findByUserId(transaction.tnxTo);
			if (!userWallet) {
				throw BusinessError.create(useBundle('wallet.error.notFound', { id: transaction.tnxTo }));
			}
			const updatedWallet = Wallet.cancelWithdraw(userWallet, transaction.amount);
			await walletRepository.store(updatedWallet);
		}

		const cancelledTransaction = Transaction.markAsCancelled(transaction);
		await transactionRepository.store(cancelledTransaction);

		logger.info(
			getMessage('transaction.cancelled', { id: transaction.id.value, cancelledAt: new Date() })
		);

		return cancelledTransaction;
	}

export { makeCancelTransaction };
export type { CancelTransaction };