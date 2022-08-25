import { SearchClient } from "@/client/app/usecase/searchClients"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import Joi from "types-joi";
import { serializeForEmployee } from "../serializers/serializerForEmployee";

type Dependencies = {
    searchClient: SearchClient;
}

const {getFilter, getPagination} = makePaginator({
    filter: Joi.object({
        searchTerm: Joi.string()
    }),
})

const searchClientHandler = handler(({searchClient}: Dependencies) => 
    async (req, res) => {
        const pagination = getPagination(req);
        const filter = getFilter(req);

        
        const result = await searchClient({pagination, filter});


        res.status(HttpStatus.OK).json({
            data: serializeForEmployee.serializeForEmployee(result.data),
            page: result.page
        })
    
});

export {searchClientHandler};