import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { ApplicationService } from "@/_lib/DDD";
import { FileRepository } from "@/_sharedKernel/domain/repo/FileRepository";


type Dependencies = {
    clientRepository: ClientRepository;
    fileRepository: FileRepository;
}


type UpdateProfileDto = Readonly<{
    file?: Express.Multer.File;
    id: string;
}>

type UpdateClientProfilePicture = ApplicationService<UpdateProfileDto, string>;

const makeUpdateClientProfilePicture = ({clientRepository, fileRepository}: Dependencies): UpdateClientProfilePicture => 
async (payload) => {
    let client = await clientRepository.findById(payload.id);

    const profilePictureUrl = await fileRepository.save({
        file: payload.file,
        userName: client.userName,
        folder: "clients"
    });

    client = Client.updateClientProfilePicture(client, profilePictureUrl);

    await clientRepository.store(client);

    return profilePictureUrl;
}

export {makeUpdateClientProfilePicture};

export type {UpdateClientProfilePicture}