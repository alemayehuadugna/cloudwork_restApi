import { ListCategories } from "@/Category/app/useCases/ListCategory";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import { Request, Response } from "express";
import Joi from "types-joi";

type Dependencies = {
    listCategories: ListCategories;
};

const {getPagination, getFilter, getSorter} = makePaginator({
    filter: Joi.object({
        Category: Joi.string()
        // firstName: Joi.string(),
        // title: Joi.string()
    })
});

const listCategoriesHandler = handler(({listCategories}: Dependencies) => async (req: Request, res: Response) => {
    

    const filter = getFilter(req);
    const pagination = getPagination(req);
    const sort = getSorter(req);

    const categories = await listCategories({pagination,filter, sort});
    console.log(categories);
    res.status(HttpStatus.OK).json(categories);
});

export {listCategoriesHandler}