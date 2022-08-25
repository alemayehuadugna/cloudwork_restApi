import { CancelTransaction } from '@/transaction/app/usecases/CancelTransaction';
import { makeValidator } from '@/_lib/http/validation/Validator';
import Joi from 'types-joi';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
	cancelTransaction: CancelTransaction;
}

const { getParams } = makeValidator({
	params: Joi.object({
		transactionId: Joi.string().required(),
	}).required(),
});

const cancelTransactionHandler = handler(
	({ cancelTransaction }: Dependencies) =>
		async (req, res) => {
			const { transactionId } = getParams(req);

			const transaction = await cancelTransaction(transactionId);

			res.status(HttpStatus.OK).json(transaction);
		}
);

export { cancelTransactionHandler };