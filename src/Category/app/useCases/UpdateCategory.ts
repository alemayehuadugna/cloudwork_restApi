import { CategoryRepository } from "@/Category/domain/CategoryRepository";
import { Category } from '@/Category/domain/Category';
import { ApplicationService } from '@/_lib/DDD';

type Dependencies = {
    categoryRepository: CategoryRepository;
};

type UpdateCategoryDTO = {
    categoryId: string;
    categoryName: string;
    subCategory: string[];
};

type UpdateCategory = ApplicationService<UpdateCategoryDTO, Category.Type>;

const makeUpdateCategory = 
    ({ categoryRepository }: Dependencies): UpdateCategory =>
    async (payload) => {
        let category = await categoryRepository.findById(payload.categoryId);

        category = Category.updateCategoryData(category, payload);

        return await categoryRepository.updateCategory(category)
        
    };

export { makeUpdateCategory };
export type { UpdateCategory };


