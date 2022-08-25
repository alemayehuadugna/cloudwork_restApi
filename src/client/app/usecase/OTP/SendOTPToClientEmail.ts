import { ClientRepository } from "@/client/domain/ClientRepository";
import { messageBundle, MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { eventProvider } from "@/_lib/pubSub/EventEmitterProvider";
import { SendClientOTPEvent } from "../../events/SendClientOTPEvent";

type Dependencies = {
  clientRepository: ClientRepository;
  messageBundle: MessageBundle;
};

type SendOTPToClientEmailDTO = Readonly<{
  email: string;
  otpFor: "Forget" | "Verification" | "2FA";
}>;

type SendOTPToClientEmail = ApplicationService<SendOTPToClientEmailDTO, void>;

const makeSendOTPToClientEmail = eventProvider<Dependencies, SendOTPToClientEmail>(
  (
      { clientRepository, messageBundle: { useBundle } },
      enqueue
    ): SendOTPToClientEmail =>
    async (payload) => {
      
      let client = await clientRepository.findByEmail(payload.email);

      if (!client) {
        throw Error("client not found");
      }

      enqueue(SendClientOTPEvent.create(client.email, payload.otpFor));
      
    }
);

export { makeSendOTPToClientEmail };
export type { SendOTPToClientEmail };
