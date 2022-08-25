import { asFunction } from "awilix";
import { withMongoProvider } from "@/_lib/MongoProvider";
import { toContainerValues } from "@/_lib/di/containerAdapters";
import { initCategoryCollection, CategoryCollection } from "./infra/CategoryCollection";
import { makeMongoCategoryRepository } from "./infra/CategoryRepositoryMongo";
import { GetCategory, makeGetCategory } from "./app/useCases/GetCategory";
import { ListCategories, makeListCategory } from "./app/useCases/ListCategory";
import { CategoryRepository } from "./domain/CategoryRepository";
import { makeModule } from "@/context";
import { makeCategoryController } from "./interface/routes";
import { CreateCategory, makeCreateCategory } from "./app/useCases/CreateCategory";
import { categoryMessages } from "./message";
import { DeleteCategory, makeDeleteCategory } from "./app/useCases/DeleteCategory";
import { makeUpdateCategory, UpdateCategory } from "./app/useCases/UpdateCategory";

type CategoryRegistry = {
    categoryCollection: CategoryCollection;
    categoryRepository: CategoryRepository;
    createCategory: CreateCategory;
    updateCategory:UpdateCategory;
    getCategory: GetCategory;
    listCategories: ListCategories;
    deleteCategory: DeleteCategory;

};

const categoryModule = makeModule(
    "Category", async ({container: {register, build},messageBundle: {updateBundle},}) => {
        const collections = await build(
            withMongoProvider({
                categoryCollection: initCategoryCollection,
            })
            );
            
            
            updateBundle(categoryMessages);
            
            register({
                ...toContainerValues(collections),
            categoryRepository: asFunction(makeMongoCategoryRepository),
            createCategory: asFunction(makeCreateCategory),
            updateCategory: asFunction(makeUpdateCategory),
            getCategory: asFunction(makeGetCategory),
            listCategories: asFunction(makeListCategory),
            deleteCategory: asFunction(makeDeleteCategory)
        });

        build(makeCategoryController);
    }
);

export {categoryModule};
export type {CategoryRegistry}