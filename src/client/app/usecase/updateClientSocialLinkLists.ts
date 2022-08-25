import { Client, SocialLinks } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
  clientRepository: ClientRepository;
};

type updateSocialLinkListDTO = Readonly<{
  socialLinks: SocialLinks[];
  clientId: string;
}>;

type UpdateClientSocialLinkList = ApplicationService<updateSocialLinkListDTO, string>;

const makeUpdateClientSocialLinkList =
  ({ clientRepository }: Dependencies): UpdateClientSocialLinkList =>
  async (payload) => {
    let client = await clientRepository.findById(payload.clientId);
    client = Client.updateSocialLinkList(client, payload.socialLinks);

    await clientRepository.store(client);

    return client.id.value;
  };

export { makeUpdateClientSocialLinkList };
export type { UpdateClientSocialLinkList };
