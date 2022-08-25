import { AuthRepository } from "@/auth/domain/AuthRepository";
import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository"
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
    clientRepository: ClientRepository;
    authRepository: AuthRepository;
    messageBundle: MessageBundle;
};

type changeClientPasswordDTO = Readonly<{
    oldPassword: string;
    newPassword: string;
    clientId: string;
}>

type ChangeClientPassword = ApplicationService<changeClientPasswordDTO, string>;

const makeChangeClientPassword = ({clientRepository, authRepository, messageBundle: {useBundle}}: Dependencies): ChangeClientPassword => 
async (payload) => {
    let client = await clientRepository.findById(payload.clientId);

    const isPasswordMatch = await authRepository.comparePassword(payload.oldPassword, client.password);
    if(isPasswordMatch){
        var hashedPassword = await authRepository.hashPassword(payload.newPassword);
        client = Client.changePassword(client, hashedPassword);

    }else{
        throw Error("wrong password")
    }

    await clientRepository.store(client);

    return client.id.value;
}

export {makeChangeClientPassword};
export type {ChangeClientPassword};