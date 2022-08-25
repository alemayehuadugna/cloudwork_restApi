import { ListJobForUser } from "@/job/app/useCases/ListJobsForUser";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";
import { serializeForEmployee } from "../serializers/serializerForEmployees";

type Dependencies = {
  listJobForUser: ListJobForUser;
};

const { getParams } = makeValidator({
  params: Joi.object({
    userId: Joi.string().required(),
  }).required(),
});

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

const listJobForUserHandler = handler(
  ({ listJobForUser }: Dependencies) =>
    async (req, res) => {
      const { userId } = getParams(req);
      const filter = getFilter(req);
      const pagination = getPagination(req);
      const sort = getSorter(req);

      const result = await listJobForUser(
        {
          userId,
          filter,
          sort,
          pagination,
        },
      );

      res.status(HttpStatus.OK).json({
        data: serializeForEmployee.serializeForEmployee(result.data),
        page: result.page,
      });
    }
);

export { listJobForUserHandler };
