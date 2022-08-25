import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { PaginatedFilteredQuery, PaginatedQueryResult, QueryHandler } from "@/_lib/CQRS";


type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type SearchFilter = {
	search?: string;
}

type SearchFreelancer = QueryHandler<PaginatedFilteredQuery<SearchFilter>, PaginatedQueryResult<Freelancer.Type[]>>;

const makeSearchFreelancer = ({ freelancerRepository }: Dependencies): SearchFreelancer =>
	async (payload) => {
		const { pagination, filter } = payload;
		const result = await freelancerRepository.search({ pagination, filter });
		return result;
	}

export { makeSearchFreelancer };
export type { SearchFreelancer };