import { AggregateRoot } from "@/_lib/DDD";
import { makeWithInvariants } from '@/_lib/WithInvariants';
import { FeedbackId } from "./FeedbackId";

namespace Feedback{

    type Feedback = AggregateRoot<FeedbackId> &
        Readonly<{
            firstName: string;
            lastName: string;
            message: string;
            title: string;
            state: "CREATED" | "DELETED"
            createdAt: Date;
            updatedAt: Date;
        }>;
    
    type FeedbackProps = Readonly<{
        id: FeedbackId;
        firstName: string;
        lastName: string;
        message: string;
        title: string;
    }>;

    const withInvariants = makeWithInvariants<Feedback>((self, assert) => {
        assert(self.title?.length > 0);
        assert(self.message?.length > 0);
    })


    export const create = withInvariants(
        function (props: FeedbackProps): Feedback {
            return ({
                id: props.id,
                firstName: props.firstName,
                lastName: props.lastName,
                message: props.message,
                title: props.title,
                state: 'CREATED',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    ) ;

    export const markAsDeleted = withInvariants((self: Feedback): Feedback => ({
        ...self,
        state: "DELETED"
    }));

    export type Type = Feedback;
} 

export {Feedback}