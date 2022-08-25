import { messageSource } from "@/_lib/message/MessageBundle";

type CategoryMessages = {
    Category: {
        error: {
            notFound: {id: string};
        };
        created: {id: string};
    };
};

const categoryMessages = messageSource<CategoryMessages>({
    Category: {
        error: {
            notFound: "Can't find Category #({{id}})",
        },
        created: "Category created with id #({{id}})"
    },
});

export {categoryMessages};

export type {CategoryMessages};