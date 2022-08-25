import { messageSource } from "@/_lib/message/MessageBundle";

type FeedbackMessages = {
    feedback: {
        error: {
            notFound: {id: string};
        };
        created: {id: string};
    };
};

const feedbackMessages = messageSource<FeedbackMessages>({
    feedback: {
        error: {
            notFound: "Can't find feedback #({{id}})",
        },
        created: "Feedback created with id #({{id}})"
    },
});

export {feedbackMessages};

export type {FeedbackMessages};