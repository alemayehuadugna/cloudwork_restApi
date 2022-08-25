import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";
import { Freelancer } from '@/freelancer/domain/Freelancer';

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type updateFreelancerOverviewDTO = Readonly<{
	overview: string;
	id: string;
}>;

type UpdateOverview = ApplicationService<updateFreelancerOverviewDTO, string>;

const makeUpdateOverview = ({ freelancerRepository }: Dependencies): UpdateOverview =>
	async (payload) => {
		let freelancer = await freelancerRepository.findById(payload.id);


		let completedPercentage = freelancer.profileCompletedPercentage;
		if (!(!!freelancer.overview) && !!payload.overview) 
			completedPercentage += (100 / 13);
		
		if (completedPercentage > 65)
			freelancer = Freelancer.markAsProfileCompleted(freelancer);

		freelancer = Freelancer.updateOverview(
			freelancer,
			payload.overview,
			completedPercentage
		);

		await freelancerRepository.store(freelancer);

		return freelancer.id.value;
	}

export { makeUpdateOverview };
export type { UpdateOverview };