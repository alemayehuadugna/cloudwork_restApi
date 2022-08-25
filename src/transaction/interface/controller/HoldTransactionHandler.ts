import { makeValidator } from '@/_lib/http/validation/Validator';
import Joi from 'types-joi';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';
import { HoldTransaction } from '@/transaction/app/usecases/HoldTransaction';

type Dependencies = {
	holdTransaction: HoldTransaction;
}

const { getParams } = makeValidator({
	params: Joi.object({
		transactionId: Joi.string().required(),
	}).required(),
});

const holdTransactionHandler = handler(
	({ holdTransaction }: Dependencies) =>
		async (req, res) => {
			const { transactionId } = getParams(req);

			const transaction = await holdTransaction(transactionId);

			res.status(HttpStatus.OK).json(transaction);
		}
)

export { holdTransactionHandler };