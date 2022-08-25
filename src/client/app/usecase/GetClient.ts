import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
  clientRepository: ClientRepository;
};

type GetClient = ApplicationService<string, Client.Type>;

const makeGetClient =
  ({ clientRepository }: Dependencies): GetClient =>
  async (payload: string) => {
    let client = await clientRepository.findById(payload);

    return client;
  };

export { makeGetClient };

export type {GetClient}
