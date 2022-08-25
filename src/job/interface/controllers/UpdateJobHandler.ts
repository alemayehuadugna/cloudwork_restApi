import { UpdateJob } from "@/job/app/useCases/UpdateJob";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";
import { serializeForEmployee } from "../serializers/serializerForEmployees";

type Dependencies = {
  updateJob: UpdateJob;
};

const { getBody } = makeValidator({
  body: Joi.object({
    clientId: Joi.string().required(),
    title: Joi.string().required(),
    category: Joi.string().required(),
    language: Joi.string().allow("", null),
    budget: Joi.number().required(),
    duration: Joi.number().required(),
    expiry: Joi.string().allow("", null),
    links: Joi.array().items(Joi.string()).min(0),
    description: Joi.string().required(),
    skills: Joi.array().items(Joi.any()),
  }).required(),
});

const updateJobHandler = handler(
  ({ updateJob }: Dependencies) =>
    async (req, res) => {
      const { jobId } = req.params;
      let {
        clientId,
        title,
        category,
        language,
        budget,
        duration,
        skills,
        expiry,
        links,
        description,
      } = getBody(req);

      var newDate;

      if (expiry == null || expiry == "") {
        newDate = undefined;
      } else {
        newDate = new Date(expiry);
      }

      if (language == null || language == "") {
        language = undefined;
      }

      const result = await updateJob({
        jobId,
        clientId,
        title,
        category,
        language,
        budget,
        duration,
        skills,
        newDate,
        links,
        description,
      });

      res.status(HttpStatus.OK).json({
        data: serializeForEmployee.serializeForEmployee(result),
      });
    }
);

export { updateJobHandler };
