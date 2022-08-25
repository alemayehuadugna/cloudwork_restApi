import { messageSource } from "@/_lib/message/MessageBundle";

type EmployeeMessages = {
    employee: {
        error: {
            notFound: { id: string };
            alreadyExists: { id: string };
        },
        created: { id: string };
    };
};

const employeeMessages = messageSource<EmployeeMessages>({
    employee: {
        error: {
            alreadyExists:
                "can't recreate the employee #({{ id }}) because it was already created.",
            notFound: "Can't find Employee #({{ id }})",
        },
        created: "Employee created with id #({{ id }})",
    },
});

export { employeeMessages };
export type { EmployeeMessages };