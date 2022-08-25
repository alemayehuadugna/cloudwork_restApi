import { AggregateRoot } from "@/_lib/DDD";
import { makeWithInvariants } from "@/_lib/WithInvariants";
import { MilestoneId } from "./MilestoneId";

namespace Milestone {

    type Milestone = AggregateRoot<MilestoneId> & 
        Readonly<{
            Name: string;	
            Budget: Number;
            Progress: Number;
            Paid: Boolean;
            state: 'ACTIVE' | 'DEACTIVATED' | 'DELETED';
            StartDate: Date;
            EndDate: Date;
            version:Number;
           
        }>;

    const withInvariants = makeWithInvariants<Milestone>(function (self, assert) {
        assert(self.Name?.length > 0);
        });
    
    type MilestoneProps = Readonly<{
            id: MilestoneId;
            Name: string;	
            Budget: Number;            
            StartDate: Date;
            EndDate: Date;

    }>;

    export const create = function (props: MilestoneProps): Milestone {
        return ({
            ...props,
            state: 'ACTIVE',
            Progress:0,
            Paid:false,
            version: 0,
        });
    };

    export const markAsDeleted = withInvariants(
        function (self: Milestone) : Milestone {
            return ({
                ...self,
                state: 'DELETED',
            });
        }
    );

    export const updateData = withInvariants(
        function (self: Milestone, data): Milestone {
            return ({
                ...self,
                ...data
            });
        }
    );

    export type Type = Milestone;
}

export { Milestone };