import { Category } from "@/Category/domain/Category";
import { CategoryRepository } from "@/Category/domain/CategoryRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
    categoryRepository: CategoryRepository;
}

type GetCategory = ApplicationService<string, Category.Type>;

const makeGetCategory = ({categoryRepository}: Dependencies): GetCategory => async (payload: string) => {
    let category = await categoryRepository.findById(payload);
    
    return category;
};

export {makeGetCategory};
export type {GetCategory};