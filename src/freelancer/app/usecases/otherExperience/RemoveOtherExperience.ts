import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import { Freelancer } from '@/freelancer/domain/Freelancer';


type Dependencies = {
	freelancerRepository: FreelancerRepository;
	messageBundle: MessageBundle;
};

type RemoveOtherExperienceDTO = Readonly<{
	freelancerId: string;
	otherExperienceId: string;
}>;

type RemoveOtherExperience = ApplicationService<RemoveOtherExperienceDTO, string>;

const makeRemoveOtherExperience = (
	({ freelancerRepository, messageBundle: { useBundle } }: Dependencies): RemoveOtherExperience =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.freelancerId);

			let removeIndex = -1;
			freelancer.otherExperiences.forEach((otherExperience, index) => {
				if (otherExperience.id.equals(payload.otherExperienceId))
					removeIndex = index;
			});

			if (removeIndex !== -1) {
				freelancer.otherExperiences.splice(removeIndex, 1);
			} else {
				throw BusinessError.create(
					useBundle('freelancer.error.otherExperienceNotFound', { id: payload.otherExperienceId })
				);
			}

			freelancer = Freelancer.updateOtherExperienceList(
				freelancer,
				freelancer.otherExperiences,
				freelancer.profileCompletedPercentage
			);

			await freelancerRepository.store(freelancer);

			return freelancer.id.value;
		});
		
export { makeRemoveOtherExperience };
export type { RemoveOtherExperience };