import { GetCategory } from "@/Category/app/useCases/GetCategory";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { Request, Response } from "express";

type Dependencies = {
    getCategory: GetCategory;
}

const getCategoryHandler = handler(({getCategory}: Dependencies) => async (req: Request, res: Response) => {
    const categoryId : string = req.params.id;
    const Category = await getCategory(categoryId);

    res.status(HttpStatus.OK).json(Category);
});

export {getCategoryHandler};