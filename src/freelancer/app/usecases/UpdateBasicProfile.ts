import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";
import { Freelancer } from '@/freelancer/domain/Freelancer';

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type UpdateBasicProfileDTO = Readonly<{
	available: 'Full Time' | 'Part Time' | 'Not Available';
	gender: string;
	id: string;
}>;

type UpdateBasicProfile = ApplicationService<UpdateBasicProfileDTO, string>;

const makeUpdateBasicProfile = ({ freelancerRepository }: Dependencies): UpdateBasicProfile =>
	async (payload) => {
		let freelancer = await freelancerRepository.findById(payload.id);

		let completedPercentage = freelancer.profileCompletedPercentage;
		if (!(!!freelancer.gender) && !!payload.gender) {
			completedPercentage += (100 / 13);
		}
		if (completedPercentage > 65)
			freelancer = Freelancer.markAsProfileCompleted(freelancer);

		freelancer = Freelancer.updateBasicUserInfo(
			freelancer,
			payload.gender,
			payload.available,
			completedPercentage
		);
		
		await freelancerRepository.store(freelancer);

		return freelancer.id.value;
	}

export { makeUpdateBasicProfile };
export type { UpdateBasicProfile };

