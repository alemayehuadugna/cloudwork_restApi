import { AuthRepository } from "@/auth/domain/AuthRepository";
import { ApplicationService } from '@/_lib/DDD';

type Dependencies = {
	authRepository: AuthRepository;
}

type EmailTokenDTO = {
	uid: string;
	scope: string[];
};

type GenerateEmailToken = ApplicationService<EmailTokenDTO, string>;

const makeGenerateEmailToken = ({ authRepository }: Dependencies): GenerateEmailToken =>
	async (payload) => {
		return authRepository.generateEmailVerificationToken(payload);
	};

export { makeGenerateEmailToken };
export type { GenerateEmailToken };
