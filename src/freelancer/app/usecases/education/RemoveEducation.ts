import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
	messageBundle: MessageBundle;
};

type RemoveEducationDTO = Readonly<{
	freelancerId: string;
	educationId: string;
}>;

type RemoveEducation = ApplicationService<RemoveEducationDTO, string>;

const makeRemoveEducation = (
	({ freelancerRepository, messageBundle: { useBundle } }: Dependencies): RemoveEducation =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.freelancerId);

			let removeIndex = -1;
			freelancer.educations.forEach((education, index) => {
				if (education.id.equals(payload.educationId))
					removeIndex = index;
			});

			if (removeIndex !== -1) {
				freelancer.educations.splice(removeIndex, 1);
			} else {
				throw BusinessError.create(
					useBundle('freelancer.error.educationNotFound', { id: payload.educationId })
				);
			}

			freelancer = Freelancer.updateEducation(
				freelancer,
				freelancer.educations,
				freelancer.profileCompletedPercentage
			);

			await freelancerRepository.store(freelancer);

			return freelancer.id.value;
		});

export { makeRemoveEducation };
export type { RemoveEducation };