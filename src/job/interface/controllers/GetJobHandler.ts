import { GetJob } from "@/job/app/useCases/GetJob";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from "types-joi";
import { serializer } from "../serializers/serialize";
import { serializeForEmployee } from "../serializers/serializerForEmployees";

type Dependencies = {
  getJob: GetJob;
};

const { getParams } = makeValidator({
  params: Joi.object({
    jobId: Joi.string().required(),
  }).required(),
});

const getJobHandler = handler(
  ({ getJob }: Dependencies) =>
    async (req: Request, res: Response) => {
      const { jobId } = getParams(req);

      const result = await getJob(jobId);

      res.status(HttpStatus.OK).json({
        data: serializer._serializeJob(result[0]),
      });
    }
);

const getJobForEmployees = handler(
  ({ getJob }: Dependencies) =>
    async (req: Request, res: Response) => {
      const { jobId } = getParams(req);

      const result = await getJob(jobId);
      

      res.status(HttpStatus.OK).json({
        data: serializeForEmployee.serializeForEmployee(result),
      });
    }
);

export { getJobForEmployees, getJobHandler };
