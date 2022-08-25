import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository"
import { MessageBundle } from '@/messages';
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import dayjs from "dayjs";
import { Freelancer } from '@/freelancer/domain/Freelancer';
import { AuthRepository } from "@/auth/domain/AuthRepository";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
	authRepository: AuthRepository;
	messageBundle: MessageBundle;
}

type VerifyEmailDTO = {
	otpCode: string;
	email: string;
};

type VerifyEmailWithOTP = ApplicationService<VerifyEmailDTO, string>;

const makeVerifyEmailWithOTP = ({ freelancerRepository, authRepository, messageBundle: { useBundle } }: Dependencies): VerifyEmailWithOTP =>
	async (payload) => {
		let freelancer = await freelancerRepository.findByEmail(payload.email);

		if (!freelancer) {
			throw BusinessError.create(
				useBundle("freelancer.error.notFound", { id: payload.email })
			);
		}


		if (freelancer.otp) {
			if (freelancer.otp.verified != true) {
				if (!dayjs().isAfter(freelancer.otp.expirationTime)) {
					if (payload.otpCode === freelancer.otp.code) {
						let completedPercentage = freelancer.profileCompletedPercentage;
						if (!freelancer.isEmailVerified)
							completedPercentage += (100 / 13);

						if (completedPercentage > 60)
							freelancer = Freelancer.markAsProfileCompleted(freelancer);

						freelancer = Freelancer.markAsEmailVerified(freelancer, completedPercentage);

						freelancer = Freelancer.updateOTP(freelancer, undefined);

						await freelancerRepository.store(freelancer);
					} else {
						throw BusinessError.create(
							useBundle("freelancer.error.OTPError", { message: "OTP Not Equal" }),
						);
					}
				} else {
					throw BusinessError.create(
						useBundle("freelancer.error.OTPError", { message: "OTP has Expired" })
					);
				}
			} else {
				throw BusinessError.create(
					useBundle("freelancer.error.OTPError", { message: "OTP has been used" })
				);
			}
		} else {
			throw BusinessError.create(
				useBundle("freelancer.error.OTPError", { message: "OTP is null" })
			);
		}

		return authRepository.generate({ uid: freelancer.id, scope: freelancer.roles });
	}

export { makeVerifyEmailWithOTP };
export type { VerifyEmailWithOTP };