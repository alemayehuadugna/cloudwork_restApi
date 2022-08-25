import { UpdateMilestone } from "@/milestone/app/useCases/UpdateMilestone";
import { handler } from "@/_lib/http/handler";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
    updateMilestone: UpdateMilestone;
};

const { getBody } = makeValidator({
    // body: Joi.object({
    //     firstName: Joi.string().required(),
	// 	lastName: Joi.string().required(),
	// 	phone: Joi.string().required(),
	// 	email: Joi.string().required(),
	// 	gender: Joi.string().valid('Male', 'Female').required()
    // }).required(),
}
);
 

const updateMilestoneHandler = handler(
    ({ updateMilestone }: Dependencies) =>
        async (req, res) => {
            const { milestoneId } = req.params;
            let {
                Name,
                Budget,
                Progress,
                Paid,
                StartDate,
                EndDate
               
            } = getBody(req);

            const milestone = await updateMilestone({
                milestoneId,
                Name,
                Budget,
                Progress,
                Paid,
                StartDate,
                EndDate
            });

            res.json(milestone);
        }
);

export { updateMilestoneHandler };