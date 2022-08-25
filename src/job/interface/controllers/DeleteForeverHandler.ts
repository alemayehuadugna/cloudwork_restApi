import { DeleteJobForever } from "@/job/app/useCases/DeleteForever";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
    deleteJobForever: DeleteJobForever;
};

const { getParams } = makeValidator({
    params: Joi.object({
        jobId: Joi.string().required(),
    }).required(),
});

const deleteJobForeverHandler = handler(
    ({ deleteJobForever }: Dependencies) =>
        async (req, res) => {
            const { jobId } = getParams(req);

            await deleteJobForever(jobId);

            res.status(HttpStatus.NO_CONTENT).send();
        }
);

export { deleteJobForeverHandler };