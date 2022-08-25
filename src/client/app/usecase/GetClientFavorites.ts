import { ClientRepository } from "@/client/domain/ClientRepository";
import { PaginatedQueryResult, QueryHandler } from "@/_lib/CQRS";
import { ApplicationService } from "@/_lib/DDD";
import { Address } from "@/_sharedKernel/domain/entities/Address";

type Dependencies = {
  clientRepository: ClientRepository;
};

type ClientFavoritesDTO = Readonly<{
  id: string,
  firstName: string,
  lastName: string,
  address: Address,
  skills: string[],
  expertise: string, 
  profilePicture: string,

}>

type payload = {
  clientId: string,
  pagination: any
}

type GetClientFavorites = ApplicationService<
  payload,
  PaginatedQueryResult<ClientFavoritesDTO[]>
>;

const makeGetClientFavorites =
  ({ clientRepository }: Dependencies): GetClientFavorites =>
  async (payload) => {
    const {pagination, clientId} = payload;
    console.log("Pagination", pagination);

    let clients = await clientRepository.listFavorites({pagination, clientId});

    return clients;
  };

export { makeGetClientFavorites };

export type { GetClientFavorites };
