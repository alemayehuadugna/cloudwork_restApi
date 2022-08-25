import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import { Freelancer, OtherExperience } from '@/freelancer/domain/Freelancer';

type Dependencies = {
	freelancerRepository: FreelancerRepository;
	messageBundle: MessageBundle;
};

type EditOtherExperienceDTO = Readonly<{
	subject: string;
	description: string;
	otherExperienceId: string;
	freelancerId: string;
}>;

type EditOtherExperience = ApplicationService<EditOtherExperienceDTO, OtherExperience>;

const makeEditOtherExperience = (
	({ freelancerRepository, messageBundle: { useBundle } }: Dependencies): EditOtherExperience =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.freelancerId);

			let editIndex = -1;
			freelancer.otherExperiences.forEach((otherExperience, index) => {
				if (otherExperience.id.equals(payload.otherExperienceId))
					editIndex = index;
			});

			if (editIndex !== -1) {
				freelancer.otherExperiences[editIndex].subject = payload.subject;
				freelancer.otherExperiences[editIndex].description = payload.description;
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

			return freelancer.otherExperiences[editIndex];
		});

export { makeEditOtherExperience };
export type { EditOtherExperience };