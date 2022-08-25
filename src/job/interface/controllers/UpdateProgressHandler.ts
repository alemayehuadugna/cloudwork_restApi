import { UpdateProgress } from "@/job/app/useCases/UpdateProgress";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
  updateProgress: UpdateProgress;
};

const { getBody } = makeValidator({
  body: Joi.object({
    progress: Joi.string().valid(
      "COMPLETED",
      "ACTIVE",
      "INACTIVE",
      "DELETED",
      "CANCELLED"
    ),
   clientId: Joi.string().allow(''), 
   freelancerId: Joi.string().allow('')
  }).required(),
});

const updateProgressHandler = handler(
  ({ updateProgress }: Dependencies) =>
    async (req, res) => {
      const { jobId } = req.params;
      let { progress, clientId, freelancerId } = getBody(req);

      const result = await updateProgress({
        jobId,
        progress,
        clientId, 
        freelancerId
      });

      res.status(HttpStatus.OK).json({
        id: result.id.value,
      });
    }
);

export { updateProgressHandler };
