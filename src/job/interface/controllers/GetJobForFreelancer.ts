import { GetJobForFreelancer } from "@/job/app/useCases/GetJobForFreelancer";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";
import { serializer } from "../serializers/serialize";

type Dependencies = {
  getJobForFreelancer: GetJobForFreelancer;
};

const { getParams } = makeValidator({
  params: Joi.object({
    jobId: Joi.string().required(),
  }).required(),
});

const getJobForFreelancerHandler = handler(
  ({ getJobForFreelancer }: Dependencies) =>
    async (req, res) => {
      const { jobId } = getParams(req);

      const result = await getJobForFreelancer(jobId);

      res.status(HttpStatus.OK).json({
        data: serializer._serializeJob(result[0]),
      });
    }
);

export { getJobForFreelancerHandler };
