import { ListEmployee } from "@/employee/app/usecases/ListEmployee";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import Joi from "types-joi";

type Dependencies = {
  listEmployee: ListEmployee;
};

const { getFilter, getPagination, getSorter } = makePaginator({
  filter: Joi.object({
    gender: Joi.string(),
  }),
});

const listEmployeesHandler = handler(
  ({ listEmployee }: Dependencies) =>
    async (req, res) => {
      const filter = getFilter(req);
      const pagination = getPagination(req);
      const sort = getSorter(req);

      const employees = await listEmployee({
        filter,
        sort,
        pagination,
      });

      res.status(HttpStatus.OK).json(employees);
    }
);

export { listEmployeesHandler };
