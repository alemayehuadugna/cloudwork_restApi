import { Employment, Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
	messageBundle: MessageBundle;
};

type EditEmploymentDTO = Readonly<{
	company: string;
	city: string;
	region: string;
	title: string;
	period: { start: Date; end: Date; };
	summary: string;
	id: string;
	freelancerId: string;
}>;

type EditEmployment = ApplicationService<EditEmploymentDTO, Employment>;

const makeEditEmployment = (
	({ freelancerRepository, messageBundle: { useBundle } }: Dependencies): EditEmployment =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.freelancerId);

			let editIndex = -1;
			freelancer.employments.forEach((employment, index) => {
				if (employment.id.equals(payload.id))
					editIndex = index;
			});

			if (editIndex !== -1) {
				freelancer.employments[editIndex].company = payload.company;
				freelancer.employments[editIndex].city = payload.city;
				freelancer.employments[editIndex].region = payload.region;
				freelancer.employments[editIndex].title = payload.title;
				freelancer.employments[editIndex].period = payload.period;
				freelancer.employments[editIndex].summary = payload.summary;
			} else {
				throw BusinessError.create(
					useBundle('freelancer.error.employmentNotFound', { id: payload.id })
				);
			}

			freelancer = Freelancer.updateEmployment(
				freelancer,
				freelancer.profileCompletedPercentage,
				freelancer.employments
			);

			await freelancerRepository.store(freelancer);

			return freelancer.employments[editIndex];
		});

export { makeEditEmployment };
export type { EditEmployment };