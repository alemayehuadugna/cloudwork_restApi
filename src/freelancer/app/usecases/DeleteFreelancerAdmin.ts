import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type DeleteFreelancerAdmin = ApplicationService<string, void>;

const makeDeleteFreelancerAdmin =
	({ freelancerRepository }: Dependencies): DeleteFreelancerAdmin =>
		async (payload: string) => {
			let freelancer = await freelancerRepository.findById(payload);

			await freelancerRepository.delete(freelancer.id.value);
		};

export { makeDeleteFreelancerAdmin };
export type { DeleteFreelancerAdmin };
