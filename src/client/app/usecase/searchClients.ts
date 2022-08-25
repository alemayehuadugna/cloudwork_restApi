import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository"
import { PaginatedFilteredQuery, PaginatedQueryResult, QueryHandler } from "@/_lib/CQRS";

type Dependencies = {
    clientRepository: ClientRepository;
};

type SearchFilter = {
    search?: string;
}

type SearchClient = QueryHandler<PaginatedFilteredQuery<SearchFilter>, PaginatedQueryResult<Client.Type[]>>;

const makeSearchClient = ({clientRepository}: Dependencies): SearchClient => 
async (payload) => {
    const {pagination, filter} = payload;
    const result = await clientRepository.search({pagination, filter});
    console.log("result", result);
    return result;
}

export {makeSearchClient};
export type {SearchClient}