import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type AvailabilityDTO = {
	freelancerId: string;
	availability: "Full Time" | "Part Time" | "Not Available";
};

type ChangeAvailability = ApplicationService<AvailabilityDTO, void>;

const makeChangeAvailability = ({ freelancerRepository }: Dependencies): ChangeAvailability =>
	async (payload) => {
		const freelancer = await freelancerRepository.findById(payload.freelancerId);

		const updatedFreelancer = Freelancer.changeAvailability(freelancer, payload.availability);
		await freelancerRepository.store(updatedFreelancer);
		return;
	}

export { makeChangeAvailability };
export type { ChangeAvailability };