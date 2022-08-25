import { Employee } from "@/employee/domain/Employee";
import { EmployeeListItemDTO, EmployeeRepository, SearchFilter } from "@/employee/domain/EmployeeRepository";
import { PaginatedFilteredQuery, PaginatedQuery, PaginatedQueryResult, QueryHandler } from "@/_lib/CQRS";
import { ApplicationService } from "@/_lib/DDD";


type Dependencies  = {
    employeeRepository: EmployeeRepository;
} 

type SearchEmployee =  QueryHandler<PaginatedFilteredQuery<SearchFilter>, PaginatedQueryResult<EmployeeListItemDTO[]>>

const makeSearchEmployee = 
    ({ employeeRepository }: Dependencies): SearchEmployee => 
    async (payload) => {
        const {pagination, filter} = payload;
        const result =  await employeeRepository.searchEmployee({pagination, filter});
        return result;
    };

export { makeSearchEmployee };
export type { SearchEmployee };