import { HireFreelancer } from "@/job/app/useCases/HireFreelancer";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
    hireFreelancer: HireFreelancer;
};

const { getBody } = makeValidator({
    body: Joi.object({
        freelancerId: Joi.string().required(), 
        clientId: Joi.string().required(), 
        amount: Joi.number().required()
    }).required(),
});

const hireFreelancerHandler = handler(
    ({ hireFreelancer }: Dependencies ) => 
    async (req, res) => {
        const { jobId } = req.params;
        let { freelancerId, clientId, amount } = getBody(req);

        const id = await hireFreelancer({
            jobId, 
            freelancerId, 
            clientId, 
            amount
        });
        
        res.status(HttpStatus.OK).json({
            'id': id
        });
    }
);

export { hireFreelancerHandler };