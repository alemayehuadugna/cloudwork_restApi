import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from '@/_lib/DDD';
import { Freelancer } from '../../domain/Freelancer';

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type updateMainServiceDTO = Readonly<{
	category: string;
	subCategory: string;
	freelancerId: string;
}>;

type UpdateMainService = ApplicationService<updateMainServiceDTO, string>;

const makeUpdateMainService = ({ freelancerRepository }: Dependencies): UpdateMainService =>
	async (payload) => {
		let freelancer = await freelancerRepository.findById(payload.freelancerId);

		let completedPercentage = freelancer.profileCompletedPercentage;

		if (freelancer.mainService === null && payload.category !== undefined && payload.subCategory !== undefined) {
			completedPercentage += (100 / 13);
		}
		if (completedPercentage > 65)
			freelancer = Freelancer.markAsProfileCompleted(freelancer);

		freelancer = Freelancer.updateMainService(
			freelancer,
			payload.category,
			payload.subCategory,
			completedPercentage
		);

		await freelancerRepository.store(freelancer);

		return freelancer.id.value;
	}

export { makeUpdateMainService };
export type { UpdateMainService };