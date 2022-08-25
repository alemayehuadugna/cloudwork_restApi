import { DeleteEmployee } from "@/employee/app/usecases/DeleteEmployee";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";

type Dependencies = {
    deleteEmployee: DeleteEmployee;
};

const deleteEmployeeHandler = handler(({ deleteEmployee }: Dependencies) => async (req, res) => {
    const { employeeId } = req.params;

    await deleteEmployee(employeeId);

    res.status(HttpStatus.OK).send();
});

export { deleteEmployeeHandler };