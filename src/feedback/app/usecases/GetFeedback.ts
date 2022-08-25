import { Feedback } from "@/feedback/domain/Feedback";
import { FeedbackRepository } from "@/feedback/domain/FeedbackRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
    feedbackRepository: FeedbackRepository;
}

type GetFeedback = ApplicationService<string, Feedback.Type>;

const makeGetFeedback = ({feedbackRepository}: Dependencies): GetFeedback => async (payload: string) => {
    let feedback = await feedbackRepository.findById(payload);
    
    return feedback;
};

export {makeGetFeedback};
export type {GetFeedback};