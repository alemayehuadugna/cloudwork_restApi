import { TransactionRepository } from '@/transaction/domain/TransactionRepository';
import { ApplicationService } from '@/_lib/DDD';
import { getMessage, MessageBundle } from "@/messages";
import { eventProvider } from '@/_lib/pubSub/EventEmitterProvider';
import { VerifyChapaEvent } from '@/transaction/app/event/VerifyChapaEvent';
import { WalletRepository } from '@/wallet/domain/WalletRepository';
import { BusinessError } from '@/_sharedKernel/domain/error/BusinessError';
import { Transaction } from '@/transaction/domain/Transaction';
import { Wallet } from '@/wallet/domain/Wallet';
import { Logger } from 'pino';
type Dependencies = {
	messageBundle: MessageBundle;
	transactionRepository: TransactionRepository;
	walletRepository: WalletRepository;
	logger: Logger;
};

type VerifyChapaDTO = {
	first_name: string;
	last_name: string;
	email: string;
	currency: string;
	amount: number;
	charge: number;
	status: string;
	reference: string;
	tx_ref: string;
	created_at: Date;
	updated_at: Date;
}

type VerifyChapaTransaction = ApplicationService<VerifyChapaDTO, void>;

const makeVerifyChapaTransaction = eventProvider<Dependencies, VerifyChapaTransaction>(
	({ transactionRepository, logger, walletRepository, messageBundle: { useBundle } }, enqueue): VerifyChapaTransaction =>
		async (payload) => {
			const userId = payload.tx_ref.split('_')[1];

			let userWallet = await walletRepository.findByUserId(userId);

			if (!userWallet) {
				throw BusinessError.create(
					useBundle('wallet.error.notFound', { id: userId })
				);
			}
			const amountToDeposit = payload.amount - payload.charge;
			const updatedWallet = Wallet.deposit(userWallet, amountToDeposit);

			const id = await transactionRepository.getNextId();
			const transaction = Transaction.create({
				id,
				amount: amountToDeposit,
				status: "Completed",
				tnxFrom: userId,
				remark: '',
				tnxTo: "CloudWork",
				tnxType: "Deposit",
				serviceCharge: payload.charge,
				tnxBy: { transferredThrough: 'Chapa', accountNumber: '' },
				tnxNumber: payload.reference,
			});
			await walletRepository.store(updatedWallet);
			await transactionRepository.store(transaction);

			logger.info(
				getMessage('transaction.completed', {
					id: transaction.id.value, completedAt: new Date(),
				})
			);

			enqueue(VerifyChapaEvent.create(userId, amountToDeposit));
		}
)

export { makeVerifyChapaTransaction };
export type { VerifyChapaTransaction };