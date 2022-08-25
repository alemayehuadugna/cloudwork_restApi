import { GetFeedback } from "@/feedback/app/usecases/GetFeedback";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { Request, Response } from "express";

type Dependencies = {
    getFeedback: GetFeedback;
}

const getFeedbackHandler = handler(({getFeedback}: Dependencies) => async (req: Request, res: Response) => {
    const feedbackId : string = req.params.id;
    const feedback = await getFeedback(feedbackId);

    res.status(HttpStatus.OK).json(feedback);
});

export {getFeedbackHandler};