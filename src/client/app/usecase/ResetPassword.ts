import { AuthRepository } from "@/auth/domain/AuthRepository";
import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
  clientRepository: ClientRepository;
  authRepository: AuthRepository;
};

type ResetPasswordDTO = Readonly<{
  email: string;
  password: string;
}>;

type ResetPassword = ApplicationService<ResetPasswordDTO, string>;

const makeResetPassword =
  ({ clientRepository, authRepository }: Dependencies): ResetPassword =>
  async (payload) => {
    let client = await clientRepository.findByEmail(payload.email);

    if(!client){
        throw Error("Client not found");
    }
    console.log("payload.password", payload.password);
    var hashedPassword = await authRepository.hashPassword(payload.password);

    client = Client.changePassword(client, hashedPassword);

    await clientRepository.store(client);

    console.log("after fixing ", client);

    return client.id.value;
  };

  export {makeResetPassword};
  export type {ResetPassword};
