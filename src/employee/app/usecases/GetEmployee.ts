import { Employee } from "@/employee/domain/Employee";
import { EmployeeRepository } from "@/employee/domain/EmployeeRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
    employeeRepository: EmployeeRepository;
}

type GetEmployee = ApplicationService<string, Employee.Type>;

const makeGetEmployee = 
    ({ employeeRepository }: Dependencies): GetEmployee =>
    async (payload: string) => {
        let employee = await employeeRepository.findById(payload);

        return employee;
    };

    export { makeGetEmployee };
    export type { GetEmployee };