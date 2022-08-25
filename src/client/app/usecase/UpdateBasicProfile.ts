import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
  clientRepository: ClientRepository;
};

type UpdateBasicProfileDTO = Readonly<{
  firstName: string;
  lastName: string;
  email: string,
  phone: string,
  id: string;
}>;

type UpdateClientBasicProfile = ApplicationService<UpdateBasicProfileDTO, string>;

const makeUpdateClientBasicProfile = ({clientRepository}: Dependencies): UpdateClientBasicProfile => 
async (payload) => {
    let client = await clientRepository.findById(payload.id);

    console.log("payload", client);

    client = Client.updateBasicClientInfo(
        client,
        payload.firstName,
        payload.lastName,
        payload.email,
        payload.phone
    );

    console.log(client);

    await clientRepository.store(client);

    return client.id.value;

}

export {makeUpdateClientBasicProfile};
export type {UpdateClientBasicProfile};