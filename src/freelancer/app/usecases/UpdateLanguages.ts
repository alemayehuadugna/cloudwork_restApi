import { Freelancer, Language } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type updateLanguagesDTO = Readonly<{
	languages: Language[];
	id: string;
}>;

type UpdateLanguages = ApplicationService<updateLanguagesDTO, string>;

const makeUpdateLanguages = ({ freelancerRepository }: Dependencies): UpdateLanguages =>
	async (payload) => {
		let freelancer = await freelancerRepository.findById(payload.id);

		let completedPercentage = freelancer.profileCompletedPercentage;
		if (freelancer.languages.length === 0 && payload.languages.length > 0)
			completedPercentage += (100 / 13);

		if (completedPercentage > 65)
			freelancer = Freelancer.markAsProfileCompleted(freelancer);

		freelancer = Freelancer.updateLanguage(
			freelancer,
			payload.languages,
			completedPercentage
		);
		
		await freelancerRepository.store(freelancer);

		return freelancer.id.value;
	}

export { makeUpdateLanguages };
export type { UpdateLanguages };