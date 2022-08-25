import { DeleteJob } from "@/job/app/useCases/DeleteJob"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
    deleteJob: DeleteJob;
};

const { getBody } = makeValidator({
    body: Joi.object({
     clientId: Joi.string().allow(''), 
     freelancerId: Joi.string().allow('')
    }).required(),
  });

const deleteJobHandler = handler(({ deleteJob }: Dependencies) => async (req, res) => {
    const { jobId } = req.params;
    let { clientId, freelancerId } = getBody(req);

    await deleteJob({jobId, clientId, freelancerId});

    res.status(HttpStatus.NO_CONTENT).send();
});

export { deleteJobHandler };