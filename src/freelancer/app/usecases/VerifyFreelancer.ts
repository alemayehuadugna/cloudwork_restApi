import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";
import { Freelancer } from '@/freelancer/domain/Freelancer';

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type VerifyFreelancer = ApplicationService<string, string>;

const makeVerifyFreelancer = ({ freelancerRepository }: Dependencies): VerifyFreelancer =>
	async (payload) => {
		let freelancer = await freelancerRepository.findById(payload);

		freelancer = Freelancer.markAsVerified(freelancer);

		await freelancerRepository.store(freelancer);

		return freelancer.id.value;
	}

export { makeVerifyFreelancer };
export type { VerifyFreelancer };
