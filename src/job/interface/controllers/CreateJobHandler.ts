import { CreateJob } from "@/job/app/useCases/CreateJob";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from "types-joi";
import { serializeForEmployee } from "../serializers/serializerForEmployees";

type Dependencies = {
  createJob: CreateJob;
};

const { getBody } = makeValidator({
  body: Joi.object({
    clientId: Joi.string().required(),
    title: Joi.string().required(),
    category: Joi.string().required(),
    language: Joi.string().allow('', null),
    budget: Joi.number().required(),
    duration: Joi.number().required(),
    expiry: Joi.string().allow('', null),
    links: Joi.array().items(Joi.string()).min(0),
    description: Joi.string().required(),
    skills: Joi.array().items(Joi.any()),
  }).required(),
});

const createJobHandler = handler(
  ({ createJob }: Dependencies) =>
    async (req: Request, res: Response) => {
      let {
        clientId,
        title,
        category,
        language,
        budget,
        duration,
        expiry,
        description,
        skills,
        links,
      } = getBody(req);
      
      var newDate;
      
      if (expiry == null || expiry == '') {
        newDate = undefined;
      } else {
        newDate = new Date(expiry);
      }

      if (language == null || language == '') {
        language = undefined;
      }

      const result = await createJob({
        clientId,
        title,
        category,
        language,
        budget,
        duration,
        newDate,
        links,
        description,
        skills,
      });


      res.status(HttpStatus.OK).json({
        data: serializeForEmployee.serializeForEmployee(result),
      });
    }
);

export { createJobHandler };
