import { ListTransaction } from "@/transaction/app/usecases/ListTransactions"
import { handler } from "@/_lib/http/handler";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import Joi from "types-joi";
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
	listTransaction: ListTransaction
};

const { getFilter, getPagination, getSorter } = makePaginator({
	filter: Joi.object({
		status: Joi.string().valid('Pending', 'OnHold', 'Cancelled', 'Completed'),
		tnxType: Joi.string().valid('Deposit', 'Withdraw', 'Transfer'),
		amountRange: Joi.array().items(Joi.number().required()).min(2).max(2),
		tnxBy: Joi.string(),
	}),
});

const listTransactionHandler = handler(
	({ listTransaction }: Dependencies) =>
		async (req, res) => {
			const filter = getFilter(req);
			const pagination = getPagination(req);
			const sort = getSorter(req);

			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;
			const scope: String[] = req.auth.credentials.scope;
			console.log("scope; ", req.auth.credentials);
			if (!scope.includes('Employee')) {
				filter.userId = id;
				sort.push({
					field: "tnxTime",
					direction: 'desc'
				})
			}
			console.log('query tx: ', filter);
			const result = await listTransaction({
				filter,
				pagination,
				sort
			});

			res.status(HttpStatus.OK).json(result);
		}
);

export { listTransactionHandler };