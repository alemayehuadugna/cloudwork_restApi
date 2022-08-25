import { EmployeeRepository } from "@/employee/domain/EmployeeRepository";
import { Employee } from '@/employee/domain/Employee';
import { ApplicationService } from '@/_lib/DDD';

type Dependencies = {
    employeeRepository: EmployeeRepository;
};

type DeleteEmployee = ApplicationService<string, void>;

const makeDeleteEmployee = 
    ({ employeeRepository }: Dependencies): DeleteEmployee => 
    async (payload: string) => {
        let employee = await employeeRepository.findById(payload);

        employee = Employee.markAsDeleted(employee);

        await employeeRepository.store(employee);
    };

export { makeDeleteEmployee };
export type { DeleteEmployee };