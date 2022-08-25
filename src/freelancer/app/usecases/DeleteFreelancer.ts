import { AuthRepository } from "@/auth/domain/AuthRepository";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
	authRepository: AuthRepository;
	messageBundle: MessageBundle;
};

type DeleteFreelancerDTO = {
	reason?: string;
	password: string;
	id: string;
}

type DeleteFreelancer = ApplicationService<DeleteFreelancerDTO, void>;

const makeDeleteFreelancer =
	({ freelancerRepository, authRepository, messageBundle: { useBundle } }: Dependencies): DeleteFreelancer =>
		async (payload) => {
			let freelancer = await freelancerRepository.findById(payload.id);
			console.log("password: ", payload.password, " fp: ", freelancer.id);
			const isPasswordMatch = await authRepository.comparePassword(payload.password, freelancer.password);

			if (isPasswordMatch) {

				await freelancerRepository.delete(freelancer.id.value);
			} else {
				throw BusinessError.create(
					useBundle('freelancer.error.wrongPassword')
				);
			}


		};

export { makeDeleteFreelancer };
export type { DeleteFreelancer };
