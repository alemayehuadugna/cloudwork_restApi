import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type GetFreelancer = ApplicationService<string, Freelancer.Type>;

const makeGetFreelancer =
	({ freelancerRepository }: Dependencies): GetFreelancer =>
	async (payload: string) => {
		let freelancer = await freelancerRepository.findById(payload);

		return freelancer;
	};

export { makeGetFreelancer };
export type { GetFreelancer };
