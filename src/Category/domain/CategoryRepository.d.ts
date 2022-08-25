import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Repository } from "@/_lib/DDD";
import { Category } from "./Category";
import { CategoryId } from "./CategoryId";

type CategoryListItemDTO = Readonly<{
  id: CategoryId;
  categoryName: string;
  subCategory?: string[]| undefined;
}>;

type CategoryFilter = {
  categoryName?: string

};
type SearchFilter = {
  search?: string;
}


type CategoryRepository = Repository<Category.Type> & {
  findById(id: string): Promise<Category.Type>;
  findCategories({pagination, filter, sort}): Promise<PaginatedQueryResult<CategoryListItemDTO[]>>;
  updateCategory(data): Promise<Category.Type>;
  delete(id: string): Promise<void>;
  searchCategory({pagination, filter}): Promise<PaginatedQueryResult<CategoryListItemDTO[]>>;

};

export { CategoryRepository};

export type {CategoryListItemDTO, CategoryFilter, SearchFilter}
