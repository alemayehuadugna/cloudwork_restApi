import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
	messageBundle: MessageBundle;
};

type EditPortfolioDTO = Readonly<{
	title: string;
	projectUrl: string;
	projectDescription: string;
	skills: String[];
	files?: unknown[];
	freelancerId: string;
	portfolioId: string;
}>;

type EditPortfolio = ApplicationService<EditPortfolioDTO, string>;

const makeEditPortfolio = (
	({ freelancerRepository, messageBundle: { useBundle } }: Dependencies): EditPortfolio =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.freelancerId);

			let editIndex = -1;
			freelancer.portfolios.forEach((portfolio, index) => {
				if (portfolio.id.equals(payload.portfolioId))
					editIndex = index;
			});

			if (editIndex !== -1) {
				freelancer.portfolios[editIndex].title = payload.title;
				freelancer.portfolios[editIndex].projectUrl = payload.projectUrl;
				freelancer.portfolios[editIndex].projectDescription = payload.projectDescription;
				freelancer.portfolios[editIndex].skills = payload.skills;
				freelancer.portfolios[editIndex].files = payload.files;
			} else {
				throw BusinessError.create(
					useBundle('freelancer.error.portfolioNotFound', { id: payload.portfolioId })
				);
			}

			freelancer = Freelancer.updatePortfolio(
				freelancer,
				freelancer.profileCompletedPercentage,
				freelancer.portfolios,
			);

			await freelancerRepository.store(freelancer);

			return freelancer.id.value;
		});

export { makeEditPortfolio };
export type { EditPortfolio };