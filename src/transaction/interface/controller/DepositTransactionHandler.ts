import { DepositTransaction } from "@/transaction/app/usecases/DepositTransaction"
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
	depositTransaction: DepositTransaction;
}

const { getBody } = makeValidator({
	body: Joi.object({
		amount: Joi.number().required(),
		tnxBy: Joi.object({
			transferredThrough: Joi.string().required(),
			accountNumber: Joi.string().required(),
		}).required(),
		tnxNumber: Joi.string().required(),
		remark: Joi.string(),
	}).required(),
});

const depositTransactionHandler = handler(
	({ depositTransaction }: Dependencies) =>
		async (req, res) => {
			let { amount, tnxBy, remark, tnxNumber } = getBody(req);

			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const transaction = await depositTransaction({
				amount,
				tnxBy,
				remark,
				tnxNumber,
				tnxFrom: id
			});

			res.status(HttpStatus.CREATED).json(transaction);
		}
)

export { depositTransactionHandler };
