import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { ApplicationService } from "@/_lib/DDD";
import { Address } from "@/_sharedKernel/domain/entities/Address";

type Dependencies = {
    clientRepository: ClientRepository;
  };

type UpdateAddressDTO = Readonly<{
    region: string;
	city: string;
	areaName?: string;
	postalCode?: string;
    id: string
}>;

type UpdateClientAddress = ApplicationService<UpdateAddressDTO, string>;

const makeUpdateClientAddress = ({clientRepository}: Dependencies): UpdateClientAddress => async (payload) => {
    let client = await clientRepository.findById(payload.id);

    let address: Address = {
         region : payload.region,
         city : payload.city,
         areaName : payload.areaName,
         postalCode : payload.postalCode
    }
    client = Client.updateAddress(client, address);

    await clientRepository.store(client);

    return client.id.value;
}

export {makeUpdateClientAddress};
export type {UpdateClientAddress};