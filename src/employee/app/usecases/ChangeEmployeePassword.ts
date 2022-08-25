import { AuthRepository } from "@/auth/domain/AuthRepository";
import { Employee } from "@/employee/domain/Employee";
import { EmployeeRepository } from "@/employee/domain/EmployeeRepository"
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
    employeeRepository: EmployeeRepository;
    authRepository: AuthRepository;
    messageBundle: MessageBundle;
};

type changeEmployeePasswordDTO = Readonly<{
    oldPassword: string;
    newPassword: string;
    employeeId: string;
}>

type ChangeEmployeePassword = ApplicationService<changeEmployeePasswordDTO, string>;

const makeChangeEmployeePassword = ({employeeRepository, authRepository, messageBundle: {useBundle}}: Dependencies): ChangeEmployeePassword => 
async (payload) => {
    let employee = await employeeRepository.findById(payload.employeeId);

    const isPasswordMatch = await authRepository.comparePassword(payload.oldPassword, employee.password);
    if(isPasswordMatch){
        var hashedPassword = await authRepository.hashPassword(payload.newPassword);
        employee = Employee.changePassword(employee, hashedPassword);

    }else{
        throw Error("wrong password")
    }

    await employeeRepository.store(employee);

    return employee.id.value;
}

export {makeChangeEmployeePassword};
export type {ChangeEmployeePassword};