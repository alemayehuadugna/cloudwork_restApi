// import { Scope } from "@/auth/interface/controllers/AccessScopeHandler";
import { Router } from "express";
import { createFeedbackHandler } from "../controller/CreateFeedbackHandler";
import { deleteFeedbackHandler } from "../controller/DeleteFeedbackHandler";
import { getFeedbackHandler } from "../controller/GetFeedbackHandler";
import { listFeedbacksHandler } from "../controller/ListFeedbackHandler";

type Dependencies = {
    apiRouter: Router;
}

const makeFeedbackController = ({apiRouter}: Dependencies) => {
    const router = Router();
    router.get("/feedbacks", listFeedbacksHandler);
    router.post("/feedbacks", createFeedbackHandler);
    router.get("/feedbacks/:id", getFeedbackHandler);
    router.delete("/feedbacks/:feedbackId", deleteFeedbackHandler);

    apiRouter.use(router);
};

export {makeFeedbackController};