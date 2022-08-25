import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Filter } from "mongodb";
import { from, v4 } from "uuid-mongodb";
import { Freelancer } from "../domain/Freelancer";
import { FreelancerId } from "../domain/FreelancerId";
import {
	FreelancerRepository,
} from "../domain/FreelancerRepository";
import { FreelancerCollection, FreelancerSchema } from "./FreelancerCollection";
import { FreelancerIdProvider } from "./FreelancerIdProvider";
import { FreelancerMapper } from "./FreelancerMapper";

type Dependencies = {
	freelancerCollection: FreelancerCollection;
};

const makeMongoFreelancerRepository = ({
	freelancerCollection,
}: Dependencies): FreelancerRepository => ({
	async getNextId(): Promise<FreelancerId> {
		return Promise.resolve(FreelancerIdProvider.create(v4().toString()));
	},
	async delete(id: string): Promise<void> {
		await freelancerCollection.findOneAndDelete({ _id: from(id) });
	},
	async findById(id: string): Promise<Freelancer.Type> {
		const freelancer = await freelancerCollection.findOne({
			_id: from(id)
		});
		if (!freelancer) {
			throw new Error("Freelancer not found");
		}
		return FreelancerMapper.toDomainEntity(freelancer);
	},
	async findByPhone(phone: string): Promise<Freelancer.Type> {
		const freelancer = await freelancerCollection.findOne({
			phone: phone,
			state: "ACTIVE",
		});
		if (!freelancer) {
			throw new Error("Freelancer not found");
		}
		return FreelancerMapper.toDomainEntity(freelancer);
	},
	async findByEmail(email: string): Promise<Freelancer.Type> {
		const freelancer = await freelancerCollection.findOne({
			email: { $regex: `^${email}`, $options: 'i' },
			state: "ACTIVE",
		});
		if (!freelancer) {
			throw new Error("Freelancer not found");
		}
		return FreelancerMapper.toDomainEntity(freelancer);
	},
	async store(entity: Freelancer.Type): Promise<void> {
		FreelancerIdProvider.validate(entity.id);

		const { _id, version, ...data } = FreelancerMapper.toOrmEntity(entity);

		const count = await freelancerCollection.countDocuments({ _id });

		if (count) {
			await freelancerCollection.updateOne(
				{ _id, version },
				{
					$set: {
						...data,
						updatedAt: new Date(),
						version: version + 1,
					},
				}
			);
			return;
		}

		await freelancerCollection.insertOne({
			_id,
			...data,
			version,
		});
	},
	async find({
		pagination,
		filter,
		sort,
	}): Promise<PaginatedQueryResult<Freelancer.Type[]>> {
		let match: Filter<FreelancerSchema> = {

		};

		if (filter.expertise) {
			match = {
				...match,
				expertise: { $regex: `^${filter.expertise}`, $options: 'i' },
			};
		}
		if (filter.gender) {
			match = {
				...match,
				gender: { $regex: `^${filter.gender}`, $options: 'i' },
			}
		}
		if (filter.joinedBetween) {
			match = {
				...match,
				joinedDate: {
					$gte: new Date(filter.joinedBetween[0]),
					$lt: new Date(filter.joinedBetween[1])
				}
			}
		}

		if (filter.verified) {
			match = {
				...match,
				verified: filter.verified === "true"
			}
		}

		const freelancers = await freelancerCollection
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
			])
			.toArray();

		const totalElements = await freelancerCollection.countDocuments(match);

		const totalPages = Math.ceil(totalElements / pagination.pageSize);

		return {
			data: FreelancerMapper.toDomainEntities(freelancers),
			page: {
				totalPages,
				pageSize: pagination.pageSize,
				totalElements,
				current: pagination.page,
				first: pagination.page === 1,
				last: pagination.page === totalPages,
			},
		};
	},
	async search({
		pagination,
		filter,
	}): Promise<PaginatedQueryResult<Freelancer.Type[]>> {

		const freelancers = await freelancerCollection
			.aggregate([
				{
					$match: { $text: { $search: filter.searchItem } }
				},
				{
					$sort: { score: { $meta: "textScore" } }
				},
				{
					$skip:
						Math.max(pagination.page - 1, 0) * pagination.pageSize,
				},
				{
					$limit: pagination.pageSize,
				},
			]).toArray();

		const totalElements = await freelancerCollection.countDocuments();
		const totalPages = Math.ceil(totalElements / pagination.pageSize);

		return {
			data: FreelancerMapper.toDomainEntities(freelancers),
			page: {
				totalPages,
				pageSize: pagination.pageSize,
				totalElements,
				current: pagination.page,
				first: pagination.page === 1,
				last: pagination.page === totalPages,
			}
		}
	}
});

export { makeMongoFreelancerRepository };
