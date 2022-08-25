import { DataMapper } from "@/_lib/DDD";
import { from } from "uuid-mongodb";
import { Category } from "../domain/Category";
import { CategorySchema } from "./CategoryCollection";
import { CategoryIdProvider } from "./CategoryProvider";

const CategoryMapper : DataMapper<Category.Type, CategorySchema> = {
    toOrmEntity: (domainEntity: Category.Type) => ({
        _id: from(domainEntity.id.value),
        categoryName: domainEntity.categoryName,
        subCategory:domainEntity.subCategory,
        status: domainEntity.state,
        deleted: domainEntity.state === 'DELETED',
        createdAt: domainEntity.createdAt,
        updatedAt: domainEntity.updatedAt
    }),

    toOrmEntities: function(ormEntities: Category.Type[]){
        return ormEntities.map(entity => this.toOrmEntity(entity));
    },

    toDomainEntity: (ormEntities: CategorySchema) => ({
        id: CategoryIdProvider.create(from(ormEntities._id).toString()),
        categoryName: ormEntities.categoryName,
        subCategory:ormEntities.subCategory,
        state: ormEntities.status,
        createdAt: ormEntities.createdAt,
        updatedAt: ormEntities.updatedAt
    }),

    toDomainEntities: function(ormEntities: any[]) {
        return ormEntities.map(entity => this.toDomainEntity(entity));
    }
};

export {CategoryMapper}