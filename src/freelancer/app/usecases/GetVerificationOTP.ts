import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ApplicationService } from "@/_lib/DDD";
import otpGenerator from 'otp-generator';
import { Freelancer } from '@/freelancer/domain/Freelancer';
import dayjs from "dayjs";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
}

type VerificationOTPDTO = {
	email: string;
	otpFor: "2FA" | "Verification" | "Forget";
};

type GenerateVerificationOTP = ApplicationService<VerificationOTPDTO, string>;

const makeGenerateVerificationOTP = ({ freelancerRepository }: Dependencies): GenerateVerificationOTP =>
	async (payload) => {

		// Generate OTP
		const code = otpGenerator.generate(4, { digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
		const expirationTime: Date = dayjs().add(15, 'm').toDate();

		const otp = {
			code,
			expirationTime,
			verified: false,
			for: payload.otpFor,
		};

		let freelancer = await freelancerRepository.findByEmail(payload.email);
		if (freelancer) {
			freelancer = Freelancer.updateOTP(freelancer, otp);
			await freelancerRepository.store(freelancer);
		}

		return code;
	}

export { makeGenerateVerificationOTP };
export type { GenerateVerificationOTP };