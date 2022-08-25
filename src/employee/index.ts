import { asFunction } from "awilix";
import { withMongoProvider } from "@/_lib/MongoProvider";
import { toContainerValues } from "@/_lib/di/containerAdapters";
import {
    initEmployeeCollection,
    EmployeeCollection,
} from "./infrastructure/EmployeeCollection";
import { employeeMessages } from "./messages";
import { makeMongoEmployeeRepository } from "./infrastructure/EmployeeRepositoryMongo";
import { CreateEmployee, makeCreateEmployee } from "./app/usecases/CreateEmployee";
import { GetEmployee, makeGetEmployee } from "./app/usecases/GetEmployee";
import { ListEmployee, makeListEmployee } from "./app/usecases/ListEmployee"; 
import { DeleteEmployee, makeDeleteEmployee } from "./app/usecases/DeleteEmployee";
import { EmployeeRepository } from "./domain/EmployeeRepository";
import { makeModule } from "@/context";
import { makeEmployeeController } from "./interface/routes";
import { makeUpdateEmployee, UpdateEmployee } from "./app/usecases/UpdateEmployee";
import { makeSearchEmployee, SearchEmployee } from "./app/usecases/SearchEmployee";
import { EmployeeActivation, makeEmployeeActivation } from "./app/usecases/EmployeeActivation";
import { makeUpdateEmployeeBasicProfile, UpdateEmployeeBasicProfile } from "./app/usecases/UpdateBasicProfile";
import { ChangeEmployeePassword, makeChangeEmployeePassword } from "./app/usecases/ChangeEmployeePassword";

type EmployeeRegistry = {
    employeeCollection: EmployeeCollection;
    employeeRepository: EmployeeRepository;
    createEmployee: CreateEmployee;
    getEmployee: GetEmployee;
    listEmployee: ListEmployee;
    deleteEmployee: DeleteEmployee;
    updateEmployee: UpdateEmployee;
    updateEmployeeBasicProfile: UpdateEmployeeBasicProfile,
    searchEmployee: SearchEmployee;
    changeEmployeePassword: ChangeEmployeePassword;
    employeeActivation: EmployeeActivation;
    
};

const employeeModule = makeModule(
    "employee",
    async ({
        container: { register, build },
        messageBundle: { updateBundle },
    }) => {
        const collections = await build(
            withMongoProvider({
                employeeCollection: initEmployeeCollection,
            })
        );

        updateBundle(employeeMessages);

        register({
            ...toContainerValues(collections),
            employeeRepository: asFunction(makeMongoEmployeeRepository),
            createEmployee: asFunction(makeCreateEmployee),
            getEmployee: asFunction(makeGetEmployee),
            listEmployee: asFunction(makeListEmployee),
            deleteEmployee: asFunction(makeDeleteEmployee),
            updateEmployee: asFunction(makeUpdateEmployee),
            searchEmployee: asFunction(makeSearchEmployee),
            employeeActivation: asFunction(makeEmployeeActivation),
            updateEmployeeBasicProfile: asFunction(makeUpdateEmployeeBasicProfile),
            changeEmployeePassword: asFunction(makeChangeEmployeePassword),
        });

        build(makeEmployeeController);
    }
);

export { employeeModule };
export type { EmployeeRegistry };