import { Client } from "@/client/domain/Client";
import {
  ClientFilter,
  ClientRepository,
} from "@/client/domain/ClientRepository";
import {
  PaginatedQueryResult,
  QueryHandler,
  SortedPaginatedQuery,
} from "@/_lib/CQRS";

type Dependencies = {
  clientRepository: ClientRepository;
};

type ListClients = QueryHandler<
  SortedPaginatedQuery<ClientFilter>,
  PaginatedQueryResult<Client.Type[]>
>;

const makeListClient =
  ({ clientRepository }: Dependencies): ListClients =>
  async (payload) => {
      const {pagination, filter, sort} = payload;

      console.log("in usecase", filter);

      const result = await clientRepository.findClients({pagination, filter, sort});

      return result;
  };

export {makeListClient};

export type {ListClients}