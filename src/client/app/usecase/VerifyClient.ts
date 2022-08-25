import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository"
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
    clientRepository: ClientRepository;
}

type verifyDto = {
    clientId: string;
}

type VerifyClient = ApplicationService<verifyDto, string>;

const makeClientVerify = ({clientRepository}: Dependencies): VerifyClient => 
async (payload) => {
    let client = await clientRepository.findById(payload.clientId);

    client = Client.markAsVerified(client);

    await clientRepository.store(client);

    return client.id.value;
}

export {makeClientVerify};

export type {VerifyClient}