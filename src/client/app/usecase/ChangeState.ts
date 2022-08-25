import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
  clientRepository: ClientRepository;
};

type StateDTO = {
  clientId: string;
  state: "DEACTIVATED" | "ACTIVE";
};

type ChangeClientState = ApplicationService<StateDTO, void>;

const makeChangeClientState =
  ({ clientRepository }: Dependencies): ChangeClientState =>
  async (payload) => {
    let client = await clientRepository.findById(payload.clientId);

    console.log("before changed::", client);
    client = Client.changeState(client, payload.state);
    console.log("after changed::", client);
    await clientRepository.store(client);
  };

  export {makeChangeClientState};

  export type {ChangeClientState}
