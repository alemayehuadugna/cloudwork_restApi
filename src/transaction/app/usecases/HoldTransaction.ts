import { TransactionRepository } from "@/transaction/domain/TransactionRepository";
import { MessageBundle } from '@/messages';
import { Logger } from 'pino';
import { ApplicationService } from "@/_lib/DDD";
import { Transaction } from "@/transaction/domain/Transaction";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
	transactionRepository: TransactionRepository;
	messageBundle: MessageBundle;
	logger: Logger;
}

type HoldTransaction = ApplicationService<string, Transaction.Type>;

const makeHoldTransaction = ({ transactionRepository, logger, messageBundle: { getMessage, useBundle } }: Dependencies): HoldTransaction =>
	async (payload) => {
		const transaction = await transactionRepository.findById(payload);

		if (Transaction.isOnHold(transaction)) {
			throw BusinessError.create(
				useBundle('transaction.error.alreadyOnHold', { id: payload })
			);
		}

		if (Transaction.isCompleted(transaction)) {
			throw BusinessError.create(
				useBundle('transaction.error.already.Completed', { id: payload })
			);
		}

		const onHoldTransaction = Transaction.markAsOnHold(transaction);
		await transactionRepository.store(onHoldTransaction);

		return onHoldTransaction;
	}

export { makeHoldTransaction };
export type { HoldTransaction };