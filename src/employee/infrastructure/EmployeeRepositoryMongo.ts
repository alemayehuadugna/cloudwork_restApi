import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Filter } from "mongodb";
import { from, v4 } from "uuid-mongodb";
import { Employee } from "../domain/Employee";
import { EmployeeId } from "../domain/EmployeeId";
import {
	EmployeeListItemDTO,
	EmployeeRepository,
} from "../domain/EmployeeRepository";
import { EmployeeCollection, EmployeeSchema } from "./EmployeeCollection";
import { EmployeeIdProvider } from "./EmployeeIdProvider";
import { EmployeeMapper } from "./EmployeeMapper";

type Dependencies = {
	employeeCollection: EmployeeCollection;
};

const makeMongoEmployeeRepository = ({
	employeeCollection,
}: Dependencies): EmployeeRepository => ({
	async getNextId(): Promise<EmployeeId> {
		return Promise.resolve(EmployeeIdProvider.create(v4().toString()));
	},
	async findById(id: string): Promise<Employee.Type> {
		const employee = await employeeCollection.findOne({ _id: from(id) });

		if (!employee) {
			throw new Error("Employee not found");
		}

		return EmployeeMapper.toDomainEntity(employee);
	},
	async findByEmail(email: string): Promise<Employee.Type> {
		const employee = await employeeCollection.findOne({ email });
		if (!employee) {
			throw new Error("Employee not found");
		}

		return EmployeeMapper.toDomainEntity(employee)
	},
	async findByPhone(phone: string): Promise<Employee.Type> {
		const employee = await employeeCollection.findOne({ phone });
		if (!employee) {
			throw new Error("Employee not found");
		}

		return EmployeeMapper.toDomainEntity(employee);
	},
	async store(entity: Employee.Type): Promise<void> {
		EmployeeIdProvider.validate(entity.id);

		const { _id, version, ...data } = EmployeeMapper.toOrmEntity(entity);

		const count = await employeeCollection.countDocuments({ _id });

		if (count) {
			await employeeCollection.updateOne(
				{ _id, version, deleted: false },
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

		await employeeCollection.insertOne({
			_id,
			...data,
			version,
		});
	},
	async findEmployees({
		pagination,
		filter,
		sort,
	}): Promise<PaginatedQueryResult<EmployeeListItemDTO[]>> {
		let match: Filter<EmployeeSchema> = {
			deleted: false,
		};

		if (filter.gender) {
			match = {
				...match,
				gender: { $regex: `^${filter.gender}`, $options: "i" },
			};
		}

		const employees = await employeeCollection
			.aggregate([
				{
					$match: match,
				},
				{
					$skip: (pagination.page - 1) * pagination.pageSize,
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
				{
					$lookup: {
						from: "comment",
						as: "comments",
						let: { articleId: "$_id" },
						pipeline: [
							{
								$match: {
									deleted: false,
									$expr: { $eq: ["$articleId", "$$articleId"] },
								},
							},
						],
					},
				},
			])
			.toArray();

		const totalElements = await employeeCollection.countDocuments(match);

		const totalPages = Math.ceil(totalElements / pagination.pageSize);

		return {
			data: EmployeeMapper.toDomainEntities(employees),
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
	async updateEmployee(entity: Employee.Type): Promise<Employee.Type> {
		EmployeeIdProvider.validate(entity.id);

		const { _id, version, ...data } = EmployeeMapper.toOrmEntity(entity);

		const employee: any = await employeeCollection.findOneAndUpdate(
			{ _id: _id },
			{
				$set: {
					firstName: data.firstName,
					lastName: data.lastName,
					phone: data.phone,
					email: data.email,
					gender: data.gender,
				},
			},
			{
				upsert: true,
				returnDocument: "after",
			}
		);

		return EmployeeMapper.toDomainEntity(employee.value);
	},
	async searchEmployee({ pagination, filter }): Promise<PaginatedQueryResult<EmployeeListItemDTO[]>> {

		// find searched item
		const employees = await employeeCollection
			.aggregate([
				{
					$match: {
						$text: { $search: filter.searchItem },
						deleted: false
					}
				},
				{
					$sort: { score: { $meta: "textScore" } }
				},
				{
					$skip:
						Math.max(1 - pagination.page, 0) * pagination.pageSize,
				},
				{
					$limit: pagination.pageSize,
				},
			]).toArray();

		const totalElements = await employeeCollection.countDocuments();
		const totalPages = Math.ceil(totalElements / pagination.pageSize);

		return {
			data: EmployeeMapper.toDomainEntities(employees),
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
});

export { makeMongoEmployeeRepository };
