import { makeModule } from "@/context";
import { toContainerValues } from "@/_lib/di/containerAdapters";
import { withMongoProvider } from "@/_lib/MongoProvider";
import { asFunction } from "awilix";
import { AddAndRemoveClientFavorites, makeAddAndRemoveClientFavorites } from "./app/usecase/AddAndRemoveClientFavorites";
import { ChangeClientPassword, makeChangeClientPassword } from "./app/usecase/ChangeClientPassword";
import { ChangeClientState, makeChangeClientState } from "./app/usecase/ChangeState";
import { CreateClient, makeCreateClient } from "./app/usecase/CreateClient";
import { GetClient, makeGetClient } from "./app/usecase/GetClient";
import { GetClientFavorites, makeGetClientFavorites } from "./app/usecase/GetClientFavorites";
import { GenerateVerificationOTP, makeGenerateVerificationOTP } from "./app/usecase/GetVerificationOTP";
import { ListClients, makeListClient } from "./app/usecase/ListClients";
import { makeSendOTPToClientEmail, SendOTPToClientEmail } from "./app/usecase/OTP/SendOTPToClientEmail";
import { makeVerifyClientEmailWithOTP, VerifyClientEmailWithOTP } from "./app/usecase/OTP/VerifyClientEmailWithOTP";
import { makeUpdateClientAddress, UpdateClientAddress } from "./app/usecase/UpdateAddress";
import { makeUpdateClientBasicProfile, UpdateClientBasicProfile } from "./app/usecase/UpdateBasicProfile";
import { makeUpdateClientDescription, UpdateClientDescription } from "./app/usecase/UpdateDescription";
import { makeUpdateClientProfileOverview, UpdateClientProfileOverview } from "./app/usecase/updateProfileOverview";
import { makeUpdateClientProfilePicture, UpdateClientProfilePicture } from "./app/usecase/UpdateProfilePicture";
import { makeUpdateClientSocialLinkList, UpdateClientSocialLinkList } from "./app/usecase/updateClientSocialLinkLists";
import { makeClientVerify, VerifyClient } from "./app/usecase/VerifyClient";
import { ClientRepository } from "./domain/ClientRepository";
import {
  ClientCollection,
  initClientCollection,
} from "./infra/ClientCollection";
import { makeMongoClientRepository } from "./infra/ClientRepositoryMongo";
import { makeClientCreatedEmailListener } from "./interface/email/ClientCreatedEmailListener";
import { makeClientController } from "./interface/router";
import { clientMessages } from "./messages";
import { DeleteClient, makeDeleteClient } from "./app/usecase/DeleteClient";
import { DeleteClientAdmin, makeDeleteClientAdmin } from "./app/usecase/DeleteClientAdmin";
import { makeSearchClient, SearchClient } from "./app/usecase/searchClients";
import { makeResetPassword, ResetPassword } from "./app/usecase/ResetPassword";

type ClientRegistry = {
  clientCollection: ClientCollection;
  clientRepository: ClientRepository;
  createClient: CreateClient;
  listClients: ListClients;
  getClient: GetClient;
  changeClientState: ChangeClientState;
  updateClientBasicProfile: UpdateClientBasicProfile,
  updateClientProfilePicture: UpdateClientProfilePicture,
  changeClientPassword: ChangeClientPassword
  verifyClient: VerifyClient,
  updateClientDescription: UpdateClientDescription,
  sendOTPToClientEmail: SendOTPToClientEmail,
  verifyClientEmailWithOTP: VerifyClientEmailWithOTP,
  generateVerificationOTP: GenerateVerificationOTP,
  addAndRemoveClientFavorites: AddAndRemoveClientFavorites,
  getClientFavorites: GetClientFavorites,
  updateClientAddress: UpdateClientAddress,
  updateClientProfileOverview: UpdateClientProfileOverview,
  updateClientSocialLinkList: UpdateClientSocialLinkList,
  deleteClient: DeleteClient,
  deleteClientAdmin: DeleteClientAdmin,
  searchClient: SearchClient,
  resetPassword: ResetPassword
};

const clientModule = makeModule(
  "client",
  async ({
    container: { register, build },
    messageBundle: { updateBundle },
  }) => {
    const collections = await build(
      withMongoProvider({
        clientCollection: initClientCollection,
      })
    );

    updateBundle(clientMessages);

    register({
        ...toContainerValues(collections),
        clientRepository: asFunction(makeMongoClientRepository),
        createClient: asFunction(makeCreateClient),
        listClients: asFunction(makeListClient),
        getClient: asFunction(makeGetClient),
        changeClientState: asFunction(makeChangeClientState),
        updateClientBasicProfile: asFunction(makeUpdateClientBasicProfile),
        updateClientProfilePicture: asFunction(makeUpdateClientProfilePicture),
        changeClientPassword: asFunction(makeChangeClientPassword),
        verifyClient: asFunction(makeClientVerify),
        updateClientDescription: asFunction(makeUpdateClientDescription),
        sendOTPToClientEmail: asFunction(makeSendOTPToClientEmail),
        verifyClientEmailWithOTP: asFunction(makeVerifyClientEmailWithOTP),
        generateVerificationOTP: asFunction(makeGenerateVerificationOTP),
        addAndRemoveClientFavorites :asFunction(makeAddAndRemoveClientFavorites),
        getClientFavorites: asFunction(makeGetClientFavorites),
        updateClientAddress: asFunction(makeUpdateClientAddress),
        updateClientProfileOverview: asFunction(makeUpdateClientProfileOverview),
        updateClientSocialLinkList: asFunction(makeUpdateClientSocialLinkList),
        deleteClient: asFunction(makeDeleteClient),
        deleteClientAdmin: asFunction(makeDeleteClientAdmin),
        searchClient: asFunction(makeSearchClient),
        resetPassword: asFunction(makeResetPassword),
    })

    build(makeClientController);
    build(makeClientCreatedEmailListener)
  }
);

export { clientModule };
export type { ClientRegistry };
