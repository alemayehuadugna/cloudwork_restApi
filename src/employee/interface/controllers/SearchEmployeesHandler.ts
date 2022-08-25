import { SearchEmployee } from "@/employee/app/usecases/SearchEmployee";
import { handler } from "@/_lib/http/handler";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import Joi from "types-joi";

type Dependencies = {
  searchEmployee: SearchEmployee;
};

const {getFilter, getPagination } = makePaginator({
    filter: Joi.object({
        searchItem: Joi.string(),
    }),
});

const searchEmployeeHandler = handler(
  ({ searchEmployee }: Dependencies) =>
    async (req, res) => {
      const pagination = getPagination(req);
      const filter = getFilter(req);

      const employees = await searchEmployee({
         filter,
         pagination
      });

      res.json(employees);
    }
);

export { searchEmployeeHandler };
