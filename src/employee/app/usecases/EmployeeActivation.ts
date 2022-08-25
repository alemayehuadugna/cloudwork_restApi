import { EmployeeRepository } from "@/employee/domain/EmployeeRepository";
import { Employee } from "@/employee/domain/Employee";
import { ApplicationService } from '@/_lib/DDD';

type Dependencies = {
    employeeRepository: EmployeeRepository;
}

type ActivationDTO = Readonly<{
    employeeId: string;
    state: string;
}>;

type EmployeeActivation = ApplicationService<ActivationDTO, void>;

const makeEmployeeActivation =
    ({ employeeRepository }: Dependencies): EmployeeActivation => 
    async (payload: ActivationDTO) => {
        let employee = await employeeRepository.findById(payload.employeeId);

        employee = Employee.markActivation(employee, payload.state);

        await employeeRepository.store(employee);
    };

export { makeEmployeeActivation };
export type { EmployeeActivation };