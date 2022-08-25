
import { Employment, Freelancer } from '@/freelancer/domain/Freelancer';
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from '@/_lib/DDD';
import { ObjectId } from "bson";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type AddEmploymentDTO = Readonly<{
	company: string;
	city: string;
	region: string;
	title: string;
	period: { start: Date; end: Date; };
	summary: string;
	id: string;
}>

type AddEmployment = ApplicationService<AddEmploymentDTO, Employment>;

const makeAddEmployment = (
	({ freelancerRepository }: Dependencies): AddEmployment =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.id);

			// Create new Employment Object
			let employment: Employment = {
				id: new ObjectId(),
				company: payload.company,
				city: payload.city,
				region: payload.region,
				title: payload.title,
				period: payload.period,
				summary: payload.summary,
			}

			// Push the new Employment
			freelancer.employments.push(employment);

			freelancer = Freelancer.updateEmployment(
				freelancer,
				freelancer.profileCompletedPercentage,
				freelancer.employments,
			);

			// Save the updated freelancer
			await freelancerRepository.store(freelancer);

			return employment;
		}
)

export { makeAddEmployment };
export type { AddEmployment };