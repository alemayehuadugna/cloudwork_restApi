import { Category } from "@/Category/domain/Category";
import { CategoryRepository } from "@/Category/domain/CategoryRepository"
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
    categoryRepository: CategoryRepository;
}

type DeleteCategory = ApplicationService<string, void>;

const makeDeleteCategory = function ({ categoryRepository }: Dependencies): DeleteCategory {
    return async (payload: string) => {

        let category = await categoryRepository.findById(payload);

        category = Category.markAsDeleted(category);

        await categoryRepository.store(category);
    };
}

export {makeDeleteCategory};
export type {DeleteCategory}