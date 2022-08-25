import { DeleteFeedback } from "@/feedback/app/usecases/DeleteFeedback";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";


type Dependencies = {
    deleteFeedback: DeleteFeedback;
}

const deleteFeedbackHandler = handler(function ({ deleteFeedback }: Dependencies) {
        return async (req, res) => {
            const { feedbackId } = req.params;

            await deleteFeedback(feedbackId);

            res.status(HttpStatus.NO_CONTENT).send();
        };
    });

export {deleteFeedbackHandler};