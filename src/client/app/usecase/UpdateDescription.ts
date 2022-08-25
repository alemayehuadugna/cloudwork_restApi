import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository"
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
    clientRepository: ClientRepository;
}


type UpdateDescriptionDto = Readonly<{
    description: string;
    clientId: string
}>

type UpdateClientDescription = ApplicationService<UpdateDescriptionDto, string>;

const makeUpdateClientDescription = ({clientRepository}: Dependencies): UpdateClientDescription => 
async (payload) => {
    let client = await clientRepository.findById(payload.clientId);

    client = Client.updateDescription(client, payload.description);

    await clientRepository.store(client);

    return client.id.value;
}

export {makeUpdateClientDescription};
export type {UpdateClientDescription};