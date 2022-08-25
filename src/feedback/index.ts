import { asFunction } from "awilix";
import { withMongoProvider } from "@/_lib/MongoProvider";
import { toContainerValues } from "@/_lib/di/containerAdapters";
import { initFeedbackCollection, FeedbackCollection } from "./infra/FeedbackCollection";
import { makeMongoFeedbackRepository } from "./infra/FeedbackRepositoryMongo";
import { GetFeedback, makeGetFeedback } from "./app/usecases/GetFeedback";
import { ListFeedbacks, makeListFeedback } from "./app/usecases/ListFeedback";
import { FeedbackRepository } from "./domain/FeedbackRepository";
import { makeModule } from "@/context";
import { makeFeedbackController } from "./interface/routes";
import { CreateFeedback, makeCreateFeedback } from "./app/usecases/CreateFeedback";
import { feedbackMessages } from "./messages";
import { DeleteFeedback, makeDeleteFeedback } from "./app/usecases/DeleteFeedback";

type FeedbackRegistry = {
    feedbackCollection: FeedbackCollection;
    feedbackRepository: FeedbackRepository;
    createFeedback: CreateFeedback;
    getFeedback: GetFeedback;
    listFeedbacks: ListFeedbacks;
    deleteFeedback: DeleteFeedback
};

const feedbackModule = makeModule(
    "feedback", async ({container: {register, build}, messageBundle: {updateBundle},}) => {
        const collections = await build(
            withMongoProvider({
                feedbackCollection: initFeedbackCollection
            })
            );
            
            
            updateBundle(feedbackMessages);
            
            register({
                ...toContainerValues(collections),
            feedbackRepository: asFunction(makeMongoFeedbackRepository),
            createFeedback: asFunction(makeCreateFeedback),
            getFeedback: asFunction(makeGetFeedback),
            listFeedbacks: asFunction(makeListFeedback),
            deleteFeedback: asFunction(makeDeleteFeedback)
        });
        

        build(makeFeedbackController);
    }
);

export {feedbackModule};
export type {FeedbackRegistry as FeedbackRegistry}