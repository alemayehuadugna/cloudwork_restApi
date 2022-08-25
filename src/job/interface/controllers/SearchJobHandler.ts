import { SearchJob } from "@/job/app/useCases/SearchJob"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import Joi from "types-joi";
import { serializeForEmployee } from "@/job/interface/serializers/serializerForEmployees";

type Dependencies = {
    searchJob: SearchJob;
}

const { getFilter, getPagination } = makePaginator({
    filter: Joi.object({
        searchItem: Joi.string()
    }),
});

const searchJobHandler = handler(({ searchJob }: Dependencies) => 
    async (req, res) => {
        const pagination = getPagination(req);
        const filter = getFilter(req);

        const result = await searchJob({
            pagination, filter
        });

        res.status(HttpStatus.OK).json({
            data: serializeForEmployee.serializeForEmployee(result.data),
            page: result.page
        })
    }
);

export { searchJobHandler };