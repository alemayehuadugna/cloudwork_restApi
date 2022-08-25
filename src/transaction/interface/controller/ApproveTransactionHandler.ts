import { ApproveTransaction } from "@/transaction/app/usecases/ApproveTransaction"
import { makeValidator } from '@/_lib/http/validation/Validator';
import Joi from 'types-joi';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
	approveTransaction: ApproveTransaction;
}

const { getParams } = makeValidator({
	params: Joi.object({
		transactionId: Joi.string().required(),
	}).required(),
});

const approveTransactionHandler = handler(
	({ approveTransaction }: Dependencies) => 
		async (req, res) => {
			let { transactionId } = getParams(req);
			
			const transaction = await approveTransaction(transactionId);

			res.status(HttpStatus.OK).json(transaction);
		}
);

export {approveTransactionHandler };