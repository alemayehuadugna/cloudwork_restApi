import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";
import { Freelancer } from "../../domain/Freelancer";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type updateExpertiseDTO = Readonly<{
	expertise: string;
	id: string;
}>;

type UpdateExpertise = ApplicationService<updateExpertiseDTO, string>;

const makeUpdateExpertise = ({ freelancerRepository }: Dependencies): UpdateExpertise =>
	async (payload) => {
		let freelancer = await freelancerRepository.findById(payload.id);

		let completedPercentage = freelancer.profileCompletedPercentage;
		
		if (!(!!freelancer.expertise) && !!payload.expertise)
			completedPercentage += (100 / 13);

		if (completedPercentage > 65)
			freelancer = Freelancer.markAsProfileCompleted(freelancer);

		freelancer = Freelancer.updateExpertise(freelancer, payload.expertise, completedPercentage);

		await freelancerRepository.store(freelancer);

		return freelancer.id.value;
	}

export { makeUpdateExpertise };
export type { UpdateExpertise };
