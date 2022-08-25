import { AggregateRoot } from "@/_lib/DDD";
import { makeWithInvariants } from '@/_lib/WithInvariants';
import { CategoryId } from "./CategoryId";

namespace Category{

    type Category = AggregateRoot<CategoryId> &
        Readonly<{
            categoryName: string;
            state: "CREATED" | "DELETED";
            subCategory?: string[];
            createdAt: Date;
            updatedAt: Date;

        }>;
    
    type CategoryProps = Readonly<{
        id: CategoryId;
        categoryName: string;
        subCategory?: string[];

    }>;

    const withInvariants = makeWithInvariants<Category>((self, assert) => {
        assert(self.categoryName?.length > 0);

    })


    export const create = withInvariants(
        function (props: CategoryProps): Category {
            return ({
                id: props.id,
                categoryName: props.categoryName,
                subCategory: props.subCategory,
                state: 'CREATED',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
    ) ;
    export const updateProgressState = withInvariants(
        function (self: Category, data): Category {
            return ({
                ...self,
                state: data.state
            });
        }
    );

    export const updateCategoryData = withInvariants(
        function (self: Category, data): Category {
            return ({
                ...self,
                ...data
            });
        }
    );

    export const markAsDeleted = withInvariants((self: Category): Category => ({
        ...self,
        state: "DELETED"
    }));

    export type Type = Category;
} 

export {Category}