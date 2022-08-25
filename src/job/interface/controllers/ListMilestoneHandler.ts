import { ListMilestone } from "@/job/app/useCases/ListMilestones";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";
type Dependencies = {
  listMilestone: ListMilestone;
};

const { getFilter, getPagination, getSorter } = makePaginator({
  filter: Joi.object({}),
});

const { getBody } = makeValidator( {
  body: Joi.object({
    type: Joi.string().required(),
  }).required(),
});

const listMilestoneHandler = handler(
  ({ listMilestone }: Dependencies) =>
    async (req, res) => {
      const { jobId } = req.params;
      const filter = getFilter(req);
      const pagination = getPagination(req);
      const sort = getSorter(req);
      let {
        type
      } =  getBody(req);

      const result = await listMilestone({
        jobId,
        filter,
        sort,
        pagination,
        type
      });

      res.status(HttpStatus.OK).json({ data: result.data, page: result.page });
    }
);

export { listMilestoneHandler };
