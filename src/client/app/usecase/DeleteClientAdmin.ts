import { ClientRepository } from "@/client/domain/ClientRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
  clientRepository: ClientRepository;
};

type DeleteClientAdmin = ApplicationService<string, void>;

const makeDeleteClientAdmin =
  ({ clientRepository }: Dependencies): DeleteClientAdmin =>
  async (payload: string) => {
    console.log("ezh is here mtf", payload);
    let client = await clientRepository.findById(payload);
    console.log("client is here", client);
    await clientRepository.delete(client.id.value);
  };

export { makeDeleteClientAdmin };
export type { DeleteClientAdmin };
