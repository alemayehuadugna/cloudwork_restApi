import { WithdrawTransaction } from "@/transaction/app/usecases/WithdrawTransaction"
import { handler } from "@/_lib/http/handler";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
	withdrawTransaction: WithdrawTransaction;
};

const { getBody } = makeValidator({
	body: Joi.object({
		amount: Joi.number().required(),
		tnxBy: Joi.object({
			transferredThrough: Joi.string().required(),
			accountNumber: Joi.string().required(),
		}).required(),
		remark: Joi.string(),
	}).required(),
});

const withdrawTransactionHandler = handler(
	({ withdrawTransaction }: Dependencies) =>
		async (req, res) => {
			const { amount, tnxBy, remark } = getBody(req);

			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const transaction = await withdrawTransaction({
				amount,
				tnxBy,
				tnxTo: id,
				remark
			});

			res.status(HttpStatus.CREATED).json(transaction);
		}
);

export { withdrawTransactionHandler };