import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";


type Dependencies = {
	freelancerRepository: FreelancerRepository;
	messageBundle: MessageBundle;
};

type RemovePortfolioDTO = Readonly<{
	freelancerId: string;
	portfolioId: string;
}>;

type RemovePortfolio = ApplicationService<RemovePortfolioDTO, string>;

const makeRemovePortfolio = (
	({ freelancerRepository, messageBundle: { useBundle } }: Dependencies): RemovePortfolio =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.freelancerId);

			let removeIndex = -1;
			freelancer.portfolios.forEach((portfolio, idx) => {
				if (portfolio.id.equals(payload.portfolioId))
					removeIndex = idx;
			});

			if (removeIndex !== -1) {
				freelancer.portfolios.splice(removeIndex, 1);
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

export { makeRemovePortfolio };
export type { RemovePortfolio };