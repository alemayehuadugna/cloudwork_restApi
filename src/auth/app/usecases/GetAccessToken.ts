import { AuthRepository } from "@/auth/domain/AuthRepository";
import { useBundle } from "@/messages";
import { EmployeeRepository } from "@/employee/domain/EmployeeRepository";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { ClientRepository } from "@/client/domain/ClientRepository";


type Dependencies = {
	authRepository: AuthRepository;
	employeeRepository: EmployeeRepository;
	clientRepository: ClientRepository
	freelancerRepository: FreelancerRepository;
};

type LoginParams = {
	email: string;
	password: string;
	userType: string;
};

type GenerateToken = ApplicationService<LoginParams, string>;

const makeGenerateToken =
	({ authRepository, employeeRepository, clientRepository, freelancerRepository }: Dependencies): GenerateToken =>
		async (payload) => {
			let user;

			if (payload.userType == 'Employee') {
				user = await employeeRepository.findByEmail(payload.email);
			} else if (payload.userType == 'Client') {
				user = await clientRepository.findByEmail(payload.email)
			} else if (payload.userType == 'Freelancer') {
				user = await freelancerRepository.findByEmail(payload.email);
			}

			if (!user) {
				throw BusinessError.create(
					useBundle("auth.error.badCredentials", { email: payload.email })
				);
			}

			const isPasswordMatch = await authRepository.comparePassword(payload.password, user.password);

			if (!isPasswordMatch) {
				throw BusinessError.create(
					useBundle("auth.error.badCredentials", { email: payload.email })
				);
			}
			console.log("user.roles: ", user.roles);
			return authRepository.generate({ uid: user.id, scope: user.roles });
		};

export { makeGenerateToken };
export type { GenerateToken };
