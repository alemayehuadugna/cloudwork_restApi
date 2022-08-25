
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";
import { SocialLinks, Freelancer } from '@/freelancer/domain/Freelancer';

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type updateSocialLinkListDTO = Readonly<{
	socialLinks: SocialLinks[];
	freelancerId: string,
}>;

type UpdateSocialLinkList = ApplicationService<updateSocialLinkListDTO, string>;

const makeUpdateSocialLinkList = ({ freelancerRepository }: Dependencies): UpdateSocialLinkList =>
	async (payload) => {
		let freelancer = await freelancerRepository.findById(payload.freelancerId);

		freelancer = Freelancer.updateSocialLinkList(
			freelancer,
			payload.socialLinks,
			freelancer.profileCompletedPercentage
		);

		await freelancerRepository.store(freelancer);
		
		return freelancer.id.value;
	}

export { makeUpdateSocialLinkList };
export type { UpdateSocialLinkList };