import { OtherExperience, Freelancer } from '@/freelancer/domain/Freelancer';
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from '@/_lib/DDD';
import { ObjectId } from "bson";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type AddOtherExperienceDTO = Readonly<{
	subject: string;
	description: string;
	freelancerId: string;
}>;

type AddOtherExperience = ApplicationService<AddOtherExperienceDTO, OtherExperience>;

const makeAddOtherExperience = (
	({ freelancerRepository }: Dependencies): AddOtherExperience =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.freelancerId);

			let otherExperience: OtherExperience = {
				id: new ObjectId(),
				subject: payload.subject,
				description: payload.description
			}

			freelancer.otherExperiences.push(otherExperience);

			freelancer = Freelancer.updateOtherExperienceList(
				freelancer,
				freelancer.otherExperiences,
				freelancer.profileCompletedPercentage
			);

			await freelancerRepository.store(freelancer);

			return otherExperience;
		});

export { makeAddOtherExperience };
export type { AddOtherExperience };