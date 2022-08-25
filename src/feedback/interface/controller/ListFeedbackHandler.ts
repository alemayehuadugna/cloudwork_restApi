import { ListFeedbacks } from "@/feedback/app/usecases/ListFeedback";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import { Request, Response } from "express";
import Joi from "types-joi";

type Dependencies = {
    listFeedbacks: ListFeedbacks;
};

const {getPagination, getFilter, getSorter} = makePaginator({
    filter: Joi.object({
        firstName: Joi.string(),
        title: Joi.string()
    })
});

const listFeedbacksHandler = handler(({listFeedbacks}: Dependencies) => async (req: Request, res: Response) => {
    const filter = getFilter(req);
    const pagination = getPagination(req);
    console.log("pagination::", pagination);
    const sort = getSorter(req);

    console.log(filter);
       
    const feedbacks = await listFeedbacks({pagination,filter, sort});
    console.log(feedbacks);
    res.status(HttpStatus.OK).json(feedbacks);
});

export {listFeedbacksHandler}