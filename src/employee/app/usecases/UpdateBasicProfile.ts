import { Employee } from "@/employee/domain/Employee";
import { EmployeeRepository } from "@/employee/domain/EmployeeRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
  employeeRepository: EmployeeRepository;
};

type UpdateBasicProfileDTO = Readonly<{
  firstName: string;
  lastName: string;
  email: string,
  id: string;
}>;

type UpdateEmployeeBasicProfile = ApplicationService<UpdateBasicProfileDTO, string>;

const makeUpdateEmployeeBasicProfile = ({employeeRepository}: Dependencies): UpdateEmployeeBasicProfile => 
async (payload) => {
    let employee = await employeeRepository.findById(payload.id);

    console.log("payload");

    employee = Employee.updateBasicEmployeeInfo(
        employee,
        payload.firstName,
        payload.lastName,
        payload.email,
        
    );

    console.log(employee);

    await employeeRepository.store(employee);

    return employee.id.value;

}

export {makeUpdateEmployeeBasicProfile};
export type {UpdateEmployeeBasicProfile};