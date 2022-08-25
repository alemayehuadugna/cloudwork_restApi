import { serializeForEmployee } from "@/job/interface/serializers/serializerForEmployees";
import { ListJob } from "@/job/app/useCases/ListJob";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import Joi from "types-joi";

type Dependencies = {
  listJob: ListJob;
};

const { getFilter, getPagination, getSorter } = makePaginator({
  filter: Joi.object({
    progress: Joi.string().valid(
      "COMPLETED",
      "ACTIVE",
      "INACTIVE",
      "DELETED",
      "CANCELLED"
    ),
  }),
});

const listJobHandler = handler(
  ({ listJob }: Dependencies) =>
    async (req, res) => {
      const filter = getFilter(req);
      const pagination = getPagination(req);
      const sort = getSorter(req);

      const result = await listJob({
        filter,
        sort,
        pagination,
      });

      res.status(HttpStatus.OK).json({
        data: serializeForEmployee.serializeForEmployee(result.data),
        page: result.page,
      });
    }
);

export { listJobHandler };
