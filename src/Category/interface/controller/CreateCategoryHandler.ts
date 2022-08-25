import { CreateCategory } from "@/Category/app/useCases/CreateCategory";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import joi from "types-joi";

type Dependencies = {
  createCategory: CreateCategory;
};

const { getBody } = makeValidator({
  // body: joi.object({
  //   categoryName: joi.string().required(),
  //   subCategory:joi.array().items(joi.string()),
    
  //   }).required(),
});

const createCategoryHandler = handler(({ createCategory }: Dependencies) =>
    async (req: Request, res: Response) => {
      let { categoryName,subCategory} = getBody(req);

      console.log("id: ", categoryName);
      const CategoryId = await createCategory({
        categoryName,
        subCategory,

      });

      res.status(HttpStatus.OK).json({id: CategoryId});
    }
);

export {createCategoryHandler}
