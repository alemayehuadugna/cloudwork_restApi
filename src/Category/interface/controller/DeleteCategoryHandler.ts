import { DeleteCategory } from "@/Category/app/useCases/DeleteCategory";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";


type Dependencies = {
    deleteCategory: DeleteCategory;
}

const deleteCategoryHandler = handler(function ({ deleteCategory }: Dependencies) {
        return async (req, res) => {
            const { categoryId } = req.params;

            await deleteCategory(categoryId);

            res.status(HttpStatus.NO_CONTENT).send();
        };
    });

export {deleteCategoryHandler};