import { AggregateRoot } from "@/_lib/DDD";
import { makeWithInvariants } from "@/_lib/WithInvariants";
import { EmployeeId } from "./EmployeeId";

namespace Employee {

    type Employee = AggregateRoot<EmployeeId> & 
        Readonly<{
            firstName: string;
            lastName: string;
            phone: string;
            email: string;
            password: string;
            gender: string;
            roles: string[];
            state: 'ACTIVE' | 'DEACTIVATED' | 'DELETED';
            createdAt: Date;
            updatedAt: Date;
            version: number;
        }>;

    const withInvariants = makeWithInvariants<Employee>(function (self, assert) {
        assert(self.firstName?.length > 0);
        assert(self.lastName?.length > 0);
        assert(self.phone?.length > 0);
        assert(self.email?.length > 0);
        assert(self.password?.length > 0);
        assert(self.gender?.length > 0);
        assert(self.roles?.length > 0);
    });
    
    type EmployeeProps = Readonly<{
        id: EmployeeId;
        firstName: string;
        lastName: string;
        phone: string;
        email: string;
        password: string;
        gender: string;
        roles: string[];
    }>;

    export const create = function (props: EmployeeProps): Employee {
        return ({
            ...props,
            state: 'ACTIVE',
            createdAt: new Date(),
            updatedAt: new Date(),
            version: 0,
        });
    };

    export const markAsDeleted = withInvariants(
        function (self: Employee) : Employee {
            return ({
                ...self,
                state: 'DELETED',
            });
        }
    );

    export const updateData = withInvariants(
        function (self: Employee, data): Employee {
            return ({
                ...self,
                ...data
            });
        }
    );

    export const markActivation = withInvariants(
        function (self: Employee, state: any) : Employee {
            return ({
                ...self,
                state: state,
            });
        }
    );
    export const changePassword = withInvariants(
        (self: Employee, newPassword: string): Employee => ({
          ...self,
          password: newPassword,
        })
      );
    export const updateBasicEmployeeInfo = withInvariants(
        (
          self: Employee,
          firstName: string,
          lastName: string,
          email: string
        ): Employee => ({
          ...self,
          firstName,
          lastName,
          email,
        })
      );

    export type Type = Employee;
}

export { Employee };