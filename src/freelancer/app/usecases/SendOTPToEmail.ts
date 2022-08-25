import { FreelancerRepository } from '@/freelancer/domain/FreelancerRepository';
import { ApplicationService } from '@/_lib/DDD';
import { eventProvider } from '@/_lib/pubSub/EventEmitterProvider';
import { MessageBundle } from '@/messages';
import { BusinessError } from '@/_sharedKernel/domain/error/BusinessError';
import { SendOTPEvent } from '../events/SendOTPEvent';

type Dependencies = {
	freelancerRepository: FreelancerRepository;
	messageBundle: MessageBundle;
};

type SendOTPToEmailDTO = Readonly<{
	email: string;
	otpFor: "Forget" | "Verification" | "2FA";
}>

type SendOTPToEmail = ApplicationService<SendOTPToEmailDTO, void>;

const makeSendOTPToEmail = eventProvider<Dependencies, SendOTPToEmail>(
	({ freelancerRepository, messageBundle: { useBundle } }, enqueue): SendOTPToEmail =>
		async (payload) => {
			let freelancer = await freelancerRepository.findByEmail(payload.email);

			if (!freelancer) {
				throw BusinessError.create(
					useBundle('freelancer.error.notFound', { id: payload.email })
				);
			}

			enqueue(SendOTPEvent.create(freelancer.email, payload.otpFor));
		}
)
export { makeSendOTPToEmail };
export type { SendOTPToEmail };