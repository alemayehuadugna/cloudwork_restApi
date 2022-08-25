import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import { Education, Freelancer } from '@/freelancer/domain/Freelancer';

type Dependencies = {
	freelancerRepository: FreelancerRepository;
	messageBundle: MessageBundle;
};

type EditEducationDTO = Readonly<{
	institution: string;
	dateAttended: { start: Date; end: Date; };
	degree?: string;
	areaOfStudy: string;
	description: string;
	educationId: string;
	freelancerId: string;
}>

type EditEducation = ApplicationService<EditEducationDTO, Education>;

const makeEditEducation = (
	({ freelancerRepository, messageBundle: { useBundle } }: Dependencies): EditEducation =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.freelancerId);

			let editIndex = -1;
			freelancer.educations.forEach((education, index) => {
				if (education.id.equals(payload.educationId))
					editIndex = index;
			});

			if (editIndex !== -1) {
				freelancer.educations[editIndex].institution = payload.institution;
				freelancer.educations[editIndex].dateAttended = payload.dateAttended;
				freelancer.educations[editIndex].degree = payload.degree;
				freelancer.educations[editIndex].areaOfStudy = payload.areaOfStudy;
				freelancer.educations[editIndex].description = payload.description;
			} else {
				throw BusinessError.create(
					useBundle('freelancer.error.educationNotFound', { id: payload.educationId })
				);
			}

			// Update the edited freelancer
			freelancer = Freelancer.updateEducation(
				freelancer,
				freelancer.educations,
				freelancer.profileCompletedPercentage,
			);

			// save the updated freelancer
			await freelancerRepository.store(freelancer);

			return freelancer.educations[editIndex];
		});

export { makeEditEducation };
export type { EditEducation };