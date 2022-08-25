import { messageSource } from "@/_lib/message/MessageBundle";

type JobMessages = {
    job: {
        error: {
            notFound: { id: string };
            alreadyExists: { id: string };
            noAttachments: {id: string};
            freelancerNotFound: {id: string};
            clientNotFound: {id: string};
            progress: {id: string};
            bid: {id: string};
            userAlreadyExists: {id: string};
            notUpdated: { id: string };
            walletNotFound: {id: string};
            insufficientBalance: {id: string};
            milestoneNotCompleted: { id: string };
            termsNoAgreed: {isTermsAndConditionAgreed: boolean};
        },
        created: { id: string };
    };
};

const jobMessages = messageSource<JobMessages>({
    job: {
        error: {
            alreadyExists: 
                "can't recreate the job #({{ id }}) because it was already created.",
            notFound: "Can't find Job #({{ id }})",
            noAttachments: "Attachment not uploaded", 
            freelancerNotFound: "Can't find Freelancer #({{ id }})",
            clientNotFound: "Can't find Client #({{ id }})",
            progress: "Progress MisMatch",
            bid: "Bidding Second Time Is not Allowed", 
            userAlreadyExists: "already created #({{ id }})",
            notUpdated: "Can't update Job #({{ id }})",
            walletNotFound: "Can't find Wallet #({{ id }})",
            insufficientBalance: "Insufficient Balance #({{ id }})",
            milestoneNotCompleted: "Job Milestone Not Completed #({{ id }})",
            termsNoAgreed: "Terms And Condition Are Not Agreed #({{ isTermsAndConditionAgreed }})"
        },
        created: "Job created with id #({{ id }})",
    }
});

export { jobMessages };
export type { JobMessages };