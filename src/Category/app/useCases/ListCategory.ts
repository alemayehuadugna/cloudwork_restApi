import { CategoryFilter, CategoryListItemDTO, CategoryRepository } from "@/Category/domain/CategoryRepository";
import { PaginatedQueryResult, QueryHandler, SortedPaginatedQuery } from "@/_lib/CQRS";


type Dependencies = {
    categoryRepository: CategoryRepository;
};

// type ListCategories = ApplicationService<PaginatedQuery, PaginatedQueryResult<Category.Type[]>>;

type ListCategories = QueryHandler<SortedPaginatedQuery<CategoryFilter>, PaginatedQueryResult<CategoryListItemDTO[]>>;

const makeListCategory = ({categoryRepository}: Dependencies): ListCategories => async (payload) => {
    const {pagination, sort, filter} = payload;
    
    const result =await categoryRepository.findCategories({pagination, filter, sort});
    return result;
};

export {makeListCategory};

export type {ListCategories}