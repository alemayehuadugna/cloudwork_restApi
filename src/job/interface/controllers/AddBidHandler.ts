import { AddBid } from "@/job/app/useCases/AddBid"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";
import { serializeForEmployee } from "../serializers/serializerForEmployees";

type Dependencies = {
    addBid: AddBid;
}

const { getBody } = makeValidator( {
    body: Joi.object({
        freelancerId: Joi.string().required(), 
        budget: Joi.number().required(),
        hours: Joi.number().required(), 
        coverLetter: Joi.string().required(), 
        isTermsAndConditionAgreed: Joi.boolean().required()
    }).required(),
});

const addBidHandler = handler(
    ({ addBid }: Dependencies ) => 
        async (req, res) => {
            const { jobId } = req.params;
            let {
                freelancerId, 
                budget, 
                hours, 
                coverLetter, 
                isTermsAndConditionAgreed,  
            } = getBody(req);

            const result = await addBid({
                jobId, 
                freelancerId,
                budget, 
                hours,
                coverLetter, 
                isTermsAndConditionAgreed, 
            });

            res.status(HttpStatus.OK).json({
                data: serializeForEmployee.serializeForEmployee(result)
            })
        }
);

export { addBidHandler };