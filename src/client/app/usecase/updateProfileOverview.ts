import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
    clientRepository: ClientRepository;
  };

  type UpdateClientProfileOverviewDTO = Readonly<{
    companyName?: string,
    websiteUrl?: string
    id: string
}>;

type UpdateClientProfileOverview = ApplicationService<UpdateClientProfileOverviewDTO, string>;

const makeUpdateClientProfileOverview = ({clientRepository}: Dependencies): UpdateClientProfileOverview => async (payload) => {
    let client = await clientRepository.findById(payload.id);

    client = Client.updateProfileOverview(client, payload.companyName, payload.websiteUrl);

    await clientRepository.store(client);

    return client.id.value;
}

export {makeUpdateClientProfileOverview};
export type {UpdateClientProfileOverview};