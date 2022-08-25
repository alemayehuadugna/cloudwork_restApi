import { Category} from "@/Category/domain/Category";
import { CategoryRepository } from "@/Category/domain/CategoryRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
    categoryRepository: CategoryRepository;
}

type CreateCategoryDTO = Readonly<{
    
    categoryName: string;
    subCategory?: string[];
}>;

type CreateCategory = ApplicationService<CreateCategoryDTO, string>;

const makeCreateCategory = ({categoryRepository}: Dependencies): CreateCategory => async (payload) => {
    const id = await categoryRepository.getNextId();
    const category = Category.create({
        id,
        categoryName: payload.categoryName,
        subCategory: payload.subCategory,
    });

    await categoryRepository.store(category);
    
    return id.value;
};

export {makeCreateCategory};

export type {CreateCategory}