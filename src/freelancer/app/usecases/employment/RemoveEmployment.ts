import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
	messageBundle: MessageBundle;
};

type RemoveEmploymentDTO = Readonly<{
	freelancerId: string;
	employmentId: string;
}>;

type RemoveEmployment = ApplicationService<RemoveEmploymentDTO, string>;

const makeRemoveEmployment = (
	({ freelancerRepository, messageBundle: { useBundle } }: Dependencies): RemoveEmployment =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.freelancerId);

			let removeIndex = -1;
			freelancer.employments.forEach((employment, index) => {
				if (employment.id.equals(payload.employmentId))
					removeIndex = index;
			});

			if (removeIndex !== -1) {
				freelancer.employments.splice(removeIndex, 1);
			} else {
				throw BusinessError.create(
					useBundle('freelancer.error.portfolioNotFound', { id: payload.employmentId })
				);
			}

			freelancer = Freelancer.updateEmployment(
				freelancer,
				freelancer.profileCompletedPercentage,
				freelancer.employments
			);

			await freelancerRepository.store(freelancer);

			return freelancer.id.value;
		});

export { makeRemoveEmployment };
export type { RemoveEmployment };