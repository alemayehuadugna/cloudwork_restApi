import { PaginatedQueryResult  } from "@/_lib/CQRS";
import { Repository } from "@/_lib/DDD";
import { Employee } from "./Employee";
import { EmployeeId } from "./EmployeeId";

type EmployeeListItemDTO = Readonly<{
    id: EmployeeId;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;

    gender: string;
    roles: string[];
}>;

type EmployeeFilter = {
    gender?: string;
}

type SearchFilter = {
    search?: string;
}


type EmployeeRepository = Repository<Employee.Type> & {
    findById(id: string): Promise<Employee.Type>;
    findByPhone(phone: string): Promise<Employee.Type>;
	findByEmail(email: string): Promise<Employee.Type>;
    findEmployees({pagination, filter, sort}): Promise<PaginatedQueryResult<EmployeeListItemDTO[]>>;
    updateEmployee(data): Promise<Employee.Type>;
    searchEmployee({pagination, filter}): Promise<PaginatedQueryResult<EmployeeListItemDTO[]>>;
}

export { EmployeeRepository };
export type { EmployeeListItemDTO, EmployeeFilter, SearchFilter };