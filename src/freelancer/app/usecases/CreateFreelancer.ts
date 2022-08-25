import { AuthRepository } from "@/auth/domain/AuthRepository";
import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { Wallet } from "@/wallet/domain/Wallet";
import { WalletRepository } from "@/wallet/domain/WalletRepository";
import { ApplicationService } from "@/_lib/DDD";
import { eventProvider } from "@/_lib/pubSub/EventEmitterProvider";
import { SendOTPEvent } from "../events/SendOTPEvent";

type Dependencies = {
	freelancerRepository: FreelancerRepository;
	authRepository: AuthRepository;
	walletRepository: WalletRepository;
};

type CreateFreelancerDTO = Readonly<{
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	password: string;
	isPolicyAgreed: boolean;
}>;

type CreateFreelancer = ApplicationService<CreateFreelancerDTO, string>;

const makeCreateFreelancer = eventProvider<Dependencies, CreateFreelancer>(
	({ freelancerRepository, authRepository, walletRepository }, enqueue): CreateFreelancer =>
		async (payload) => {
			const id = await freelancerRepository.getNextId();

			var rand = Math.floor(1000 + Math.random() * 9000);
			var userName = payload.firstName + payload.lastName + rand;
			var hashedPassword = await authRepository.hashPassword(payload.password);
			const freelancer = Freelancer.create({
				id,
				firstName: payload.firstName,
				lastName: payload.lastName,
				userName,
				phone: payload.phone,
				email: payload.email,
				password: hashedPassword,
			});
			const walletId = await walletRepository.getNextId();
			const wallet = Wallet.create({ id: walletId, userId: id.value });

			await walletRepository.store(wallet);
			await freelancerRepository.store(freelancer);

			enqueue(SendOTPEvent.create(freelancer.email, "Verification"));

			return id.value;
		}
);

export { makeCreateFreelancer };
export type { CreateFreelancer };
