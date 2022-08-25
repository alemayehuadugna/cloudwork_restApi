import { PayFreelancer } from "@/job/app/useCases/PayFreelancer";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
    payFreelancer: PayFreelancer;
};

const { getBody } = makeValidator({
    body: Joi.object({
        milestoneId: Joi.string().required(), 
        freelancerId: Joi.string().required(),
        clientId: Joi.string().required(),
        amount: Joi.number().required()
    }).required(),
});

const payFreelancerHandler = handler(
    ({ payFreelancer }: Dependencies ) => 
    async (req, res) => {
        const { jobId } = req.params;
        let { freelancerId, clientId, amount, milestoneId } = getBody(req);
        const id = await payFreelancer({
            jobId, 
            freelancerId, 
            clientId, 
            amount,  
            milestoneId 
        });
        
        res.status(HttpStatus.OK).json({
            'id': id
        });
    }
);

export { payFreelancerHandler };