import { Feedback } from "@/feedback/domain/Feedback";
import { FeedbackRepository } from "@/feedback/domain/FeedbackRepository"
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
    feedbackRepository: FeedbackRepository;
}

type DeleteFeedback = ApplicationService<string, void>;

const makeDeleteFeedback = function ({ feedbackRepository }: Dependencies): DeleteFeedback {
    return async (payload: string) => {

        let feedback = await feedbackRepository.findById(payload);

        feedback = Feedback.markAsDeleted(feedback);

        await feedbackRepository.store(feedback);
    };
}

export {makeDeleteFeedback};
export type {DeleteFeedback}