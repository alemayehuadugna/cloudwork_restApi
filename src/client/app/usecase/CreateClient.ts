import { AuthRepository } from "@/auth/domain/AuthRepository";
import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { Wallet } from "@/wallet/domain/Wallet";
import { WalletRepository } from "@/wallet/domain/WalletRepository";
import { ApplicationService } from "@/_lib/DDD";
import { eventProvider } from "@/_lib/pubSub/EventEmitterProvider";
import { SendClientOTPEvent } from "../events/SendClientOTPEvent";

type Dependencies = {
  clientRepository: ClientRepository;
  authRepository: AuthRepository;
  walletRepository: WalletRepository;
};

type CreateClientDTO = Readonly<{
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
}>;

type CreateClient = ApplicationService<CreateClientDTO, string>;

const makeCreateClient = eventProvider<Dependencies, CreateClient>(
  (
      { clientRepository, authRepository, walletRepository },
      enqueue
    ): CreateClient =>
    async (payload) => {
      const id = await clientRepository.getNextId();

      // console.log("payload", payload);

      var rand = Math.floor(1000 * Math.random() * 9000);
      var userName = payload.firstName + payload.lastName + rand;
      var hashedPassword = await authRepository.hashPassword(payload.password);

      const client = Client.create({
        id,
        firstName: payload.firstName,
        lastName: payload.lastName,
        userName: userName,
        phone: payload.phone,
        email: payload.email,
        password: hashedPassword,
      });

      
      const walletId = await walletRepository.getNextId();
      const wallet = Wallet.create({ id: walletId, userId: id.value });

      await walletRepository.store(wallet);
      await clientRepository.store(client);

      enqueue(SendClientOTPEvent.create(client.email, "Verification"));

      return id.value;
    }
);

export { makeCreateClient };

export type { CreateClient };
