import { AddMilestone } from "@/job/app/useCases/AddMilestone";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";
import { serializer } from "../serializers/serialize";

type Dependencies = {
  addMilestone: AddMilestone;
}

const { getBody } = makeValidator( {
  body: Joi.object({
    name: Joi.string().required(), 
    budget: Joi.number().required(), 
    startDate: Joi.string().required(), 
    endDate: Joi.string().required(), 
    description: Joi.string().required()
  }).required(),
});

const addMilestoneHandler = handler(
  ({ addMilestone }: Dependencies ) => 
  async (req, res) => {
    const { jobId } = req.params; 
    console.log("jobId: ", jobId);
    let {
      name, 
      budget, 
      startDate, 
      endDate, 
      description
    } =  getBody(req);

    var newStartDate;
    newStartDate = new Date(startDate);

    var newEndDate;
    newEndDate = new Date(endDate);

    const result = await addMilestone({
      jobId, 
      name, 
      budget, 
      newStartDate, 
      newEndDate, 
      description
    });

    res.status(HttpStatus.OK).json({
      data: serializer._serializeJob(result),
    })
  }
);

export { addMilestoneHandler };