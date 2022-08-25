import { MilestoneFilter, MilestoneListItemDTO, MilestoneRepository } from "@/milestone/domain/MilestoneRepository";
import { PaginatedQueryResult, QueryHandler, SortedPaginatedQuery } from "@/_lib/CQRS";


type Dependencies = {
    milestoneRepository: MilestoneRepository;
};

type ListMilestones = QueryHandler<SortedPaginatedQuery<MilestoneFilter>, PaginatedQueryResult<MilestoneListItemDTO[]>>

const makeListMilestone = 
    ({ milestoneRepository }: Dependencies): ListMilestones => 
    async (payload) => {
        const { pagination, filter, sort } = payload;
        const result = await milestoneRepository.findMilestones({pagination, filter, sort});
        return result;
    };

export { makeListMilestone };
export type { ListMilestones };