import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Repository } from "@/_lib/DDD";
import { Freelancer } from "./Freelancer";

type FreelancerRepository = Repository<Freelancer.Type> & {
	findById(id: string): Promise<Freelancer.Type>;
	findByPhone(phone: string): Promise<Freelancer.Type>;
	findByEmail(email: string): Promise<Freelancer.Type>;
	find({
		pagination,
		filter,
		sort,
	}): Promise<PaginatedQueryResult<Freelancer.Type[]>>;
	delete(id: string): Promise<void>;
	search({
		pagination,
		filter,
	}): Promise<PaginatedQueryResult<Freelancer.Type[]>>;
};

export { FreelancerRepository };
