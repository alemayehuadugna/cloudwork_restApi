import { TransactionRepository } from "../domain/TransactionRepository";
import { TransactionCollection, TransactionSchema } from "./TransactionCollection"
import { TransactionIdProvider } from "./TransactionIdProvider";
import { from, v4 } from 'uuid-mongodb';
import { TransactionMapper } from "./TransactionMapper";
import { Transaction } from "../domain/Transaction";
import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Filter } from "mongodb";
import FormData from 'form-data';
import  { Axios } from "axios";

const CHAPA_URL = 'https://api.chapa.co/v1/transaction/initialize';
const CHAPA_SECRET_KEY = 'Bearer CHASECK_TEST-4fqV3zJHDrK8NjcQBLMQASaioMvCiv5g';

type Dependencies = {
	transactionCollection: TransactionCollection;
	axios: Axios;
};

const makeMongoTransactionRepository = ({ transactionCollection, axios }: Dependencies): TransactionRepository => ({
	async getNextId() {
		return Promise.resolve(TransactionIdProvider.create(v4().toString()));
	},

	async find({ pagination, filter, sort }): Promise<PaginatedQueryResult<Transaction.Type[]>> {
		let match: Filter<TransactionSchema> = {

		};
	
		if (filter.userId) {

			match = {
				...match,
				$or: [
					{ tnxFrom: filter.userId },
					{ tnxTo: filter.userId }
				]

			}
		}

		if (filter.tnxType) {
			match = {
				...match,
				tnxType: filter.tnxType
			}
		}
		if (filter.status) {
			match = {
				...match,
				status: filter.status
			}
		}

		const transactions = await transactionCollection
			.aggregate([
				{
					$match: match,
				},
				{
					$skip:
						Math.max(pagination.page - 1, 0) * pagination.pageSize,
				},
				{
					$limit: pagination.pageSize,
				},
				...(sort?.length
					? [
						{
							$sort: sort.reduce(
								(acc, { field, direction }) => ({
									[field]: direction === "asc" ? 1 : -1,
								}),
								{}
							),
						},
					]
					: []),
			]).toArray();

		const totalElements = await transactionCollection.countDocuments(match);

		const totalPages = Math.ceil(totalElements / pagination.pageSize);

		return {
			data: TransactionMapper.toDomainEntities(transactions),
			page: {
				totalPages,
				pageSize: pagination.pageSize,
				totalElements,
				current: pagination.page,
				first: pagination.page === 1,
				last: pagination.page === totalPages,
			}
		}
	},
	async store(entity: Transaction.Type): Promise<void> {
		TransactionIdProvider.validate(entity.id);

		const { _id, version, ...data } = TransactionMapper.toOrmEntity(entity);

		const count = await transactionCollection.countDocuments({ _id });

		if (count) {
			await transactionCollection.updateOne(
				{ _id, version },
				{
					$set: {
						...data,
						updatedAt: new Date(),
						version: version + 1,
					}
				}
			)
			return;
		}

		await transactionCollection.insertOne({
			_id,
			...data,
			version,
		});
	},
	async findById(id: string): Promise<Transaction.Type> {
		const transaction = await transactionCollection.findOne({ _id: from(id) });

		if (!transaction) {
			throw new Error('Transaction not found');
		}

		return TransactionMapper.toDomainEntity(transaction);
	},
	async depositWithChapa({ amount, currency, email, firstName, lastName, tx_ref }): Promise<string> {

		var data = new FormData();
		data.append('amount', amount);
		data.append('currency', currency);
		data.append('email', email);
		data.append('first_name', firstName);
		data.append('last_name', lastName);
		data.append('tx_ref', tx_ref);

		data.append('callback_url', 'https://chapa.co');
		data.append('customization[title]', '_');
		data.append('customization[description]', '_');

		var config = {
			method: 'post',
			url: CHAPA_URL,
			headers: {
				'Authorization': CHAPA_SECRET_KEY,
				...data.getHeaders()
			},
			data: data
		};

		try {
			const response = await axios.request(config);
			console.log("response.data: ", response.data.data.checkout_url);
			return response.data.data.checkout_url;
		} catch (error: any) {
			console.log("Chapa Deposit Error: ", error);
			// throw new Error('Error Initiating Transaction');
			throw error;
		}
	},
});

export { makeMongoTransactionRepository };