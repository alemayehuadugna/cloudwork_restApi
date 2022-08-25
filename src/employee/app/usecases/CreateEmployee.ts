import { Employee } from "@/employee/domain/Employee";
import { EmployeeRepository } from "@/employee/domain/EmployeeRepository";
import { ApplicationService } from "@/_lib/DDD";
import { AuthRepository } from '@/auth/domain/AuthRepository';

type Dependencies = {
    employeeRepository: EmployeeRepository;
	authRepository: AuthRepository;
}

type CreateEmployeeDTO = Readonly<{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
}>;

type CreateEmployee = ApplicationService<CreateEmployeeDTO, string>;

const makeCreateEmployee = 
    ({ employeeRepository, authRepository }: Dependencies): CreateEmployee =>
    async (payload) => {
        const id = await employeeRepository.getNextId();

		var hashedPassword = await authRepository.hashPassword("test@test");

        const employee = Employee.create({
            id,
            firstName: payload.firstName,
            lastName: payload.lastName,
            phone: payload.phone,
            email: payload.email,
            password: hashedPassword,
            gender: payload.gender,
            roles: ['Employee'],
        });

        await employeeRepository.store(employee);

        return id.value;
    };

    export { makeCreateEmployee };
    export type { CreateEmployee };