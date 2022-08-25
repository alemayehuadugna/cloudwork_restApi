import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository"
import { PaginatedFilteredQuery, PaginatedQueryResult, QueryHandler } from "@/_lib/CQRS";

type Dependencies = {
    jobRepository: JobRepository;
}

type SearchFilter = {
    search?: string;
}

type SearchJob = QueryHandler<PaginatedFilteredQuery<SearchFilter>, PaginatedQueryResult<Job.Type[]>>;

const makeSearchJob = ({ jobRepository }: Dependencies): SearchJob =>
    async (payload) => {
        const {pagination, filter} = payload;
        const result = await jobRepository.search({ pagination, filter });
        return result;
    }

export { makeSearchJob };
export type { SearchJob };