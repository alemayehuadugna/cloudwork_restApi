import { AuthRepository } from "@/auth/domain/AuthRepository";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import { Freelancer } from "../../domain/Freelancer";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
	authRepository: AuthRepository;
	messageBundle: MessageBundle;
};

type changeFreelancerPasswordDTO = Readonly<{
	oldPassword: string;
	newPassword: string;
	freelancerId: string;
}>

type ChangeFreelancerPassword = ApplicationService<changeFreelancerPasswordDTO, string>;

const makeChangeFreelancerPassword = ({ freelancerRepository, authRepository, messageBundle: { useBundle } }: Dependencies): ChangeFreelancerPassword =>
	async (payload) => {
		let freelancer = await freelancerRepository.findById(payload.freelancerId);

		const isPasswordMatch = await authRepository.comparePassword(payload.oldPassword, freelancer.password);

		if (isPasswordMatch) {
			var hashedPassword = await authRepository.hashPassword(payload.newPassword);
			freelancer = Freelancer.changePassword(freelancer, hashedPassword);
		} else {
			throw BusinessError.create(
				useBundle('freelancer.error.wrongPassword')
			);
		}

		await freelancerRepository.store(freelancer);

		return freelancer.id.value;
	}

export { makeChangeFreelancerPassword };
export type { ChangeFreelancerPassword };