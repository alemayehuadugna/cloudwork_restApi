// import { CategoryModule } from "@/Category";
import { Category } from "@/Category/domain/Category";

const _serializeCategoryForCategory = (category: Category.Type) => {
    return {
        'categoryId': category.id.value,
        'categoryName':category.id.value,
        'subCategory':category.id.value,
        // 'title': Category.title,
        // 'budget': Category.budget,
        // 'progress': Category.progress,
        // 'userId': Category.userId,
        // 'startDate': Category.startDate,
        // 'experience': Category.experience,
        // 'logo': Category.logo,
        // 'files': Category.files,
        // 'expiry': Category.expiry,
    }
}

const _serializeDetailedCategoryForCategory = (category: Category.Type) => {
    return {
        'categoryId': category.id.value,
        'categoryName':category.id.value,
        'subCategory':category.id.value,
    }
}

const serializeForCategory = {
    serializeForCategory(data) {
        if(!data) {
            throw new Error("Expect data to be not undefined nor null");
        }
        if(Array.isArray(data)) {
            return data.map(_serializeCategoryForCategory);
        }
        return _serializeDetailedCategoryForCategory(data);
    }
}

export { serializeForCategory };