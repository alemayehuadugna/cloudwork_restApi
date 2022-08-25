import { ListJobForFreelancer } from "@/job/app/useCases/ListJobsForFreelancer";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";
import { serializeForEmployee } from "../serializers/serializerForEmployees";

type Dependencies = {
  listJobForFreelancer: ListJobForFreelancer;
};

// const { getParams } = makeValidator({
//   params: Joi.object({
//     userId: Joi.string().required(),
//   }).required(),
// });

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

const listJobForFreelancerHandler = handler(
  ({ listJobForFreelancer }: Dependencies) =>
    async (req, res) => {
      const filter = getFilter(req);
      const pagination = getPagination(req);
      const sort = getSorter(req);
	  const idObject: any = req.auth.credentials.uid;
	  const userId: string = idObject.value;
	  console.log("my Id: ", userId);


      const result = await listJobForFreelancer(
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

export { listJobForFreelancerHandler };
