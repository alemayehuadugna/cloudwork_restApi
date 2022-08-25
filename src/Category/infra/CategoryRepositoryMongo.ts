import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Filter } from "mongodb";
import { from, v4 } from "uuid-mongodb";
// import { makeUpdateCategory } from "../app/usecases/UpdateCategories";
import { Category } from "../domain/Category";
import { CategoryId } from "../domain/CategoryId";
import {
  CategoryListItemDTO,
  CategoryRepository,
} from "../domain/CategoryRepository";
import { CategoryCollection, CategorySchema } from "./CategoryCollection";
import { CategoryIdProvider } from "./CategoryProvider";
import { CategoryMapper } from "./CategoryMapper";

type Dependencies = {
  categoryCollection: CategoryCollection;
};

const makeMongoCategoryRepository = ({
  categoryCollection,
}: Dependencies): CategoryRepository => ({
  async getNextId(): Promise<CategoryId> {
    return Promise.resolve(CategoryIdProvider.create(v4().toString()));
  },

  async findById(id: string): Promise<Category.Type> {
    const Category = await categoryCollection.findOne({ _id: from(id) });

    if (!Category) {
      throw new Error("Category not found");
    }

    return CategoryMapper.toDomainEntity(Category);
  },
  async store(entity: Category.Type): Promise<void> {
    CategoryIdProvider.validate(entity.id);

    const { _id, ...data } = CategoryMapper.toOrmEntity(entity);

    const count = await categoryCollection.countDocuments({ _id });

    if (count) {
      await categoryCollection.updateOne(
        { _id, deleted: false },
        {
          $set: {
            ...data,
            updatedAt: new Date(),
          },
        }
      );

      return;
    }

    await categoryCollection.insertOne({
      _id,
      ...data,
    });
  },
  async findCategories({
    pagination,
    filter,
    sort,
  }): Promise<PaginatedQueryResult<CategoryListItemDTO[]>> {
    let match: Filter<CategorySchema> = {
      status: "CREATED",
      deleted: false,
    };

    const categories = await categoryCollection
      .aggregate([
        {
          $match: match,
        },
        {
          $skip: (pagination.page - 1) * pagination.pageSize,
        },
        {
          $limit: pagination.pageSize,
        },
        ...(sort?.length
          ? [
              {
                $sort: sort.reduce(
                  (_acc, { field, direction }) => ({
                    [field]: direction === "asc" ? 1 : -1,
                  }),
                  {}
                ),
              },
            ]
          : []),
      ])
      .toArray();

    const totalElements = await categoryCollection.countDocuments(match);
    const totalPages = Math.ceil(totalElements / pagination.pageSize);

    return {
      data: CategoryMapper.toDomainEntities(categories),
      page: {
        totalPages,
        pageSize: pagination.pageSize,
        totalElements,
        current: pagination.page,
        first: pagination.page === 1,
        last: pagination.page === totalPages,
      },
    };
  },

  async updateCategory(entity: Category.Type): Promise<Category.Type> {
    CategoryIdProvider.validate(entity.id);

    const { _id, ...data } = CategoryMapper.toOrmEntity(entity);

    const category: any = await categoryCollection.findOneAndUpdate(
      { _id: _id },
      {
        $set: {
          categoryName: data.categoryName,
          subCategory: data.subCategory,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
      }
    );

    return CategoryMapper.toDomainEntity(category.value);
  },
  async delete(id: string): Promise<void> {
    await categoryCollection.findOneAndDelete({ _id: from(id) });
  },

  async searchCategory({
    pagination,
    filter,
  }): Promise<PaginatedQueryResult<CategoryListItemDTO[]>> {
    // find searched item
    const categories = await categoryCollection
      .aggregate([
        {
          $match: {
            $text: { $search: filter.searchItem },
            deleted: false,
          },
        },
        {
          $sort: { score: { $meta: "textScore" } },
        },
        {
          $skip: Math.max(1 - pagination.page, 0) * pagination.pageSize,
        },
        {
          $limit: pagination.pageSize,
        },
      ])
      .toArray();

    const totalElements = await categoryCollection.countDocuments();
    const totalPages = Math.ceil(totalElements / pagination.pageSize);

    return {
      data: CategoryMapper.toDomainEntities(categories),
      page: {
        totalPages,
        pageSize: pagination.pageSize,
        totalElements,
        current: pagination.page,
        first: pagination.page === 1,
        last: pagination.page === totalPages,
      },
    };
  },
});

export { makeMongoCategoryRepository };
