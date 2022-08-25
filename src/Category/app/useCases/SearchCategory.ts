import { Category } from '@/Category/domain/Category';
import { CategoryListItemDTO, CategoryRepository, SearchFilter } from "@/Category/domain/CategoryRepository";
import { PaginatedFilteredQuery, PaginatedQuery, PaginatedQueryResult, QueryHandler } from "@/_lib/CQRS";
import { ApplicationService } from "@/_lib/DDD";


type Dependencies  = {
    categoryRepository: CategoryRepository;
} 

type SearchCategory =  QueryHandler<PaginatedFilteredQuery<SearchFilter>, PaginatedQueryResult<CategoryListItemDTO[]>>

const makeSearchCategory = 
    ({ categoryRepository }: Dependencies): SearchCategory => 
    async (payload) => {
        const {pagination, filter} = payload;
        const result =  await categoryRepository.searchCategory({pagination, filter});
        return result;
    };

export { makeSearchCategory };
export type { SearchCategory };