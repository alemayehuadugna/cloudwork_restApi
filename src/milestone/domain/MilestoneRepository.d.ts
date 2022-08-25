import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Repository } from "@/_lib/DDD";
import { Milestone } from "./Milestone";
import { MilestoneId } from "./MilestoneId";

type MilestoneListItemDTO = Readonly<{
        id: MilestoneId;
        Name: string;	
        Budget: Number;
        Progress: Number;
        Paid: Boolean;
        StartDate: Date;
        EndDate: Date;
}>;

type MilestoneFilter = {
	Name?: string;
}

type SearchFilter = {
	Name?: string;
}


type MilestoneRepository = Repository<Milestone.Type> & {
	findById(id: string): Promise<Milestone.Type>;
	findMilestones({pagination, filter, sort}): Promise<PaginatedQueryResult<MilestoneListItemDTO[]>>;
	updateMilestone(data): Promise<Milestone.Type>;
    searchMilestone(pagination): Promise<PaginatedQueryResult<MilestoneListItemDTO[]>>;
};

export { MilestoneRepository };
export type { MilestoneListItemDTO, MilestoneFilter, SearchFilter };