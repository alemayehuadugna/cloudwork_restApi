import { Feedback } from "@/feedback/domain/Feedback";
import { FeedbackRepository } from "@/feedback/domain/FeedbackRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
    feedbackRepository: FeedbackRepository;
}

type CreateFeedbackDTO = Readonly<{
    firstName: string;
    lastName: string;
    message: string;
    title: string;
}>;

type CreateFeedback = ApplicationService<CreateFeedbackDTO, string>;

const makeCreateFeedback = ({feedbackRepository}: Dependencies): CreateFeedback => async (payload) => {
    const id = await feedbackRepository.getNextId();
    const feedback = Feedback.create({
        id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        message: payload.message,
        title: payload.title
    });

    await feedbackRepository.store(feedback);
    
    return id.value;
};

export {makeCreateFeedback};

export type {CreateFeedback}