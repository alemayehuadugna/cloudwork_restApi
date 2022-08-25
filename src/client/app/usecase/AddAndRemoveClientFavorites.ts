import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
  clientRepository: ClientRepository;
};

type AddAndRemoveClientFavoritesDto = Readonly<{
  freelancerId: string;
  clientId: string;
}>;

type AddAndRemoveClientFavorites = ApplicationService<
  AddAndRemoveClientFavoritesDto,
  string
>;

const makeAddAndRemoveClientFavorites =
  ({ clientRepository }: Dependencies): AddAndRemoveClientFavorites =>
  async (payload) => {
    let client = await clientRepository.findById(payload.clientId);

    let clientExistedFavorites = client.favorites;
  
    if (clientExistedFavorites?.length! > 0) {
      var index = clientExistedFavorites?.findIndex(function (fav) {
        return fav.freelancerId === payload.freelancerId;
      });

      if (index! != -1) {
        clientExistedFavorites?.splice(index!, 1);
      } else {
        clientExistedFavorites?.push({ freelancerId: payload.freelancerId });
      }
    } else {
      clientExistedFavorites?.push({ freelancerId: payload.freelancerId });
    }
    client = Client.updateFavorites(client, clientExistedFavorites!);

    await clientRepository.store(client);

    return client.id.value;
  };

export { makeAddAndRemoveClientFavorites };

export type { AddAndRemoveClientFavorites };
