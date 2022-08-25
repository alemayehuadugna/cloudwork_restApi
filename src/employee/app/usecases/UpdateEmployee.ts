import { EmployeeRepository } from "@/employee/domain/EmployeeRepository";
import { Employee } from '@/employee/domain/Employee';
import { ApplicationService } from '@/_lib/DDD';

type Dependencies = {
    employeeRepository: EmployeeRepository;
};

type UpdateEmployeeDTO = {
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
};

type UpdateEmployee = ApplicationService<UpdateEmployeeDTO, Employee.Type>;

const makeUpdateEmployee = 
    ({ employeeRepository }: Dependencies): UpdateEmployee =>
    async (payload) => {

        let employee = await employeeRepository.findById(payload.employeeId);

        employee = Employee.updateData(employee, payload);

        return await employeeRepository.updateEmployee(employee);
    };

export { makeUpdateEmployee };
export type { UpdateEmployee };


