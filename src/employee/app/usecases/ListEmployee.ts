import {
	EmployeeFilter,
	EmployeeListItemDTO,
	EmployeeRepository,
} from "@/employee/domain/EmployeeRepository";
import {
	PaginatedQueryResult,
	QueryHandler,
	SortedPaginatedQuery,
} from "@/_lib/CQRS";

type Dependencies = {
	employeeRepository: EmployeeRepository;
};

type ListEmployee = QueryHandler<
	SortedPaginatedQuery<EmployeeFilter>,
	PaginatedQueryResult<EmployeeListItemDTO[]>
>;

const makeListEmployee =
	({ employeeRepository }: Dependencies): ListEmployee =>
	async (payload) => {
		const { pagination, filter, sort } = payload;
		console.log("payload in usecase: ", filter);
		const result = await employeeRepository.findEmployees({
			pagination,
			filter,
			sort,
		});
		return result;
	};

export { makeListEmployee };
export type { ListEmployee };
