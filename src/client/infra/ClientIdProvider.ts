import { makeIdProvider } from "@/_lib/IdProvider";
import { ClientId } from "../domain/ClientId";

const ClientIdProvider = makeIdProvider<ClientId>("ClientId");

export {ClientIdProvider}