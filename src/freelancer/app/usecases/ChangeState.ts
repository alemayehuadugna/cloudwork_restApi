import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type StateDTO = {
	freelancerId: string;
	state: "DEACTIVATED" | "ACTIVE";
}

type ChangeFreelancerState = ApplicationService<StateDTO, void>;

const makeChangeFreelancerState = ({ freelancerRepository }: Dependencies): ChangeFreelancerState =>
	async (payload) => {
		let freelancer = await freelancerRepository.findById(payload.freelancerId);

		freelancer = Freelancer.changeState(freelancer, payload.state);
		await freelancerRepository.store(freelancer);
		return;
	}

export { makeChangeFreelancerState };
export type { ChangeFreelancerState };