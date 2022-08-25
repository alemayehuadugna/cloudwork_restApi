import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Repository } from "@/_lib/DDD"
import { Address } from "@/_sharedKernel/domain/entities/Address";
import { Client } from "./Client"


type ClientFilter = {
    address: Address;
    spending: {from: number; to: number};
    rating: {from: number; to: number}
}

type ClientFavoritesDTO = Readonly<{
    id: string,
    firstName: string,
    lastName: string,
    address: Address,
    skills: string[],
    expertise: string, 
    profilePicture: string,
  }>


type ClientRepository = Repository<Client.Type> & {
    findById(id: string): Promise<Client.Type>;
    findByPhone(phone: string): Promise<Client.Type>;
    findByEmail(email: string): Promise<Client.Type>;
    findClients({pagination, filter ,sort}): Promise<PaginatedQueryResult<Client.Type[]>>;
    listFavorites({pagination, clientId}): Promise<PaginatedQueryResult<ClientFavoritesDTO[]>>
    delete(id: string): Promise<void>;
    search({pagination, filter}): Promise<PaginatedQueryResult<Client.Type[]>>;
};



export {ClientRepository};

export type {ClientFilter, ClientFavoritesDTO}
