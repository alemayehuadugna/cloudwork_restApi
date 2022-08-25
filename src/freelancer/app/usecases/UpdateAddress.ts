import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";
import { Address } from "@/_sharedKernel/domain/entities/Address";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
};

type UpdateAddressDTO = Readonly<{
	region: string;
	city: string;
	areaName?: string;
	postalCode?: string;
	id: string;
}>;

type UpdateAddress = ApplicationService<UpdateAddressDTO, string>;

const makeUpdateAddress = ({ freelancerRepository }: Dependencies): UpdateAddress =>
	async (payload) => {
		let freelancer = await freelancerRepository.findById(payload.id);
		let loadedFreelancerAddress = freelancer.address;
		let address: Address = {
			region: payload.region,
			city: payload.city,
			areaName: payload.areaName,
			postalCode: payload.postalCode
		}

		let completedPercentage = freelancer.profileCompletedPercentage;
		if (loadedFreelancerAddress === null && payload.region !== undefined && payload.city !== undefined)
			completedPercentage += (100 / 13);

		if (completedPercentage > 65)
			freelancer = Freelancer.markAsProfileCompleted(freelancer);

		freelancer = Freelancer.updateAddress(
			freelancer,
			address,
			completedPercentage
		);

		console.log('completedPercentage Address => ',  freelancer.profileCompletedPercentage);

		await freelancerRepository.store(freelancer);

		return freelancer.id.value;
	}

export { makeUpdateAddress };
export type { UpdateAddress };
