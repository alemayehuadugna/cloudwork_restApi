import { AuthRepository } from "@/auth/domain/AuthRepository";
import { ClientRepository } from "@/client/domain/ClientRepository"
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
    clientRepository: ClientRepository;
    authRepository: AuthRepository;
    messageBundle: MessageBundle;
};

type DeleteClientDTO = {
    reason?: string;
    password: string;
    id: string;
}

type DeleteClient = ApplicationService<DeleteClientDTO, void>;

const makeDeleteClient = ({clientRepository, authRepository, messageBundle: {useBundle}}: Dependencies): DeleteClient => async (payload) => {
    let client = await clientRepository.findById(payload.id);
    const isPasswordMatch = await authRepository.comparePassword(payload.password, client.password);

    if(isPasswordMatch){
        await clientRepository.delete(client.id.value);
    }else{
        throw BusinessError.create(
            useBundle('client.error.wrongPassword')
        )
    }
}

export {makeDeleteClient};
export type {DeleteClient};