
import { Education, Freelancer } from '@/freelancer/domain/Freelancer';
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from '@/_lib/DDD';
import { ObjectId } from "bson";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type AddEducationDTO = Readonly<{
	institution: string;
	dateAttended: { start: Date; end: Date; };
	degree?: string;
	areaOfStudy: string;
	description: string;
	freelancerId: string;
}>;

type AddEducation = ApplicationService<AddEducationDTO, Education>;

const makeAddEducation = (
	({ freelancerRepository }: Dependencies): AddEducation =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.freelancerId);

			// Create new Education Object
			let education: Education = {
				id: new ObjectId(),
				institution: payload.institution,
				dateAttended: payload.dateAttended,
				degree: payload.degree,
				areaOfStudy: payload.areaOfStudy,
				description: payload.description,
			}

			// Push the new Education Object
			freelancer.educations.push(education);

			freelancer = Freelancer.updateEducation(
				freelancer,
				freelancer.educations,
				freelancer.profileCompletedPercentage
			);

			// Save the updated Freelancer
			await freelancerRepository.store(freelancer);

			return education;
		});

export { makeAddEducation };
export type { AddEducation };