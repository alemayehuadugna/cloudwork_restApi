import { Milestone } from "@/milestone/domain/Milestone";
import { MilestoneListItemDTO, MilestoneRepository, SearchFilter } from "@/milestone/domain/MilestoneRepository";
import { PaginatedFilteredQuery, PaginatedQuery, PaginatedQueryResult, QueryHandler } from "@/_lib/CQRS";
import { ApplicationService } from "@/_lib/DDD";


type Dependencies  = {
    milestoneRepository: MilestoneRepository;
} 

type SearchMilestone =  QueryHandler<PaginatedFilteredQuery<SearchFilter>, PaginatedQueryResult<MilestoneListItemDTO[]>>

const makeSearchMilestone = 
    ({ milestoneRepository }: Dependencies): SearchMilestone => 
    async (payload) => {
        const {pagination, filter} = payload;
        const result =  await milestoneRepository.searchMilestone({pagination, filter});
        return result;
    };

export { makeSearchMilestone };
export type { SearchMilestone };