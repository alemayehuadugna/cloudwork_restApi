import { Freelancer, Portfolio } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from '@/_lib/DDD';
import { ObjectId } from "bson";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type AddPortfolioDTO = Readonly<{
	title: string;
	projectUrl: string;
	projectDescription: string;
	skills: String[];
	files?: unknown[];
	id: string;
}>;

type AddPortfolio = ApplicationService<AddPortfolioDTO, string>;

const makeAddPortfolio = (
	({ freelancerRepository }: Dependencies): AddPortfolio =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.id);

			let portfolio: Portfolio = {
				id: new ObjectId(),
				title: payload.title,
				projectUrl: payload.projectUrl,
				projectDescription: payload.projectDescription,
				skills: payload.skills,
				files: payload.files
			}

			// Push the new portfolio
			freelancer.portfolios.push(portfolio);

			freelancer = Freelancer.updatePortfolio(
				freelancer,
				freelancer.profileCompletedPercentage,
				freelancer.portfolios,
			);

			await freelancerRepository.store(freelancer);

			return freelancer.id.value;
		});

export { makeAddPortfolio };
export type { AddPortfolio };