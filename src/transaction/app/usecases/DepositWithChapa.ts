import { ClientRepository } from "@/client/domain/ClientRepository";
import { EmployeeRepository } from "@/employee/domain/EmployeeRepository";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { MessageBundle } from "@/messages";
import { TransactionRepository } from "@/transaction/domain/TransactionRepository";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
	employeeRepository: EmployeeRepository;
	clientRepository: ClientRepository
	freelancerRepository: FreelancerRepository;
	messageBundle: MessageBundle;
	transactionRepository: TransactionRepository;
}

type DepositWithChapaDTO = Readonly<{
	amount: number;
	userId: string;
	userType: string;
}>;

type DepositWithChapa = ApplicationService<DepositWithChapaDTO, string>;

const makeDepositWithChapa = ({ messageBundle: { useBundle }, employeeRepository, clientRepository, freelancerRepository, transactionRepository }: Dependencies): DepositWithChapa =>
	async (payload) => {
		let user;

		if (payload.userType == 'Employee') {
			user = await employeeRepository.findById(payload.userId);
		} else if (payload.userType == 'Client') {
			user = await clientRepository.findById(payload.userId)
		} else if (payload.userType == 'Freelancer') {
			user = await freelancerRepository.findById(payload.userId);
		}

		if (!user) {
			throw BusinessError.create(
				useBundle("auth.error.badCredentials", { email: payload.userId })
			);
		}
		var rand = Math.floor(1000 + Math.random() * 90000);

		const checkoutUrl = await transactionRepository.depositWithChapa({
			amount: payload.amount,
			currency: 'ETB',
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			tx_ref: `tx_${payload.userId}_${rand}`
		});

		return checkoutUrl;
	}

export { makeDepositWithChapa };
export type { DepositWithChapa };