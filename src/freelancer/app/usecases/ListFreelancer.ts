import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { PaginatedQueryResult, QueryHandler, SortedPaginatedQuery } from "@/_lib/CQRS";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type FreelancerFilter = {
	hourlyRate: number[];
	expertise: string;
	earning: number[];
	rating: number[];
}

type ListFreelancer = QueryHandler<
	SortedPaginatedQuery<FreelancerFilter>,
	PaginatedQueryResult<Freelancer.Type[]>
>;

const makeListFreelancer =
	({ freelancerRepository }: Dependencies): ListFreelancer =>
		async (payload) => {
			const { pagination, filter, sort } = payload;
			return await freelancerRepository.find({
				pagination,
				filter,
				sort,
			});
		};

export { makeListFreelancer };
export type { ListFreelancer };
