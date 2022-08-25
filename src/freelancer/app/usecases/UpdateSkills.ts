import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type updateSkillsDTO = Readonly<{
	skills: string[];
	id: string;
}>;

type UpdateSkills = ApplicationService<updateSkillsDTO, string>;

const makeUpdateSkills = ({ freelancerRepository }: Dependencies): UpdateSkills =>
	async (payload) => {
		let freelancer = await freelancerRepository.findById(payload.id);

		let completedPercentage = freelancer.profileCompletedPercentage;
		if (freelancer.skills.length === 0 && payload.skills.length > 0) {
			completedPercentage += (100 / 13);
		}
		if (completedPercentage > 65)
			freelancer = Freelancer.markAsProfileCompleted(freelancer);

		freelancer = Freelancer.updateSkills(
			freelancer,
			payload.skills,
			completedPercentage
		);

		await freelancerRepository.store(freelancer);

		return freelancer.id.value;
	};

export { makeUpdateSkills };
export type { UpdateSkills };