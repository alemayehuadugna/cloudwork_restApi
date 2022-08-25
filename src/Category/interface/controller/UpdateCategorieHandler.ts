import { Category } from "@/Category/domain/Category";
import { UpdateCategory } from "@/Category/app/useCases/UpdateCategory";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";
import { serializeForCategory } from "../serializers/serializerForCategories";

type Dependencies = {
  updateCategory: UpdateCategory;
};

const { getBody } = makeValidator({
  // body: Joi.object({
  //     categoryName: Joi.string().required(),
  //     subCategory:Joi.string().items(Joi.string()),
  // }).required()
});

const updateCategoryHandler = handler(
  ({ updateCategory }: Dependencies) =>
    async (req, res) => {
    console.log("categoryName: ", );
      const { categoryId } = req.params;

      let { categoryName, subCategory } = getBody(req);
      

      console.log(Category);

      const result = await updateCategory({
        categoryId,
        categoryName,
        subCategory,
      });

      res.status(HttpStatus.OK).json({
        data: serializeForCategory.serializeForCategory(result),
      });
    }
);

export { updateCategoryHandler };
