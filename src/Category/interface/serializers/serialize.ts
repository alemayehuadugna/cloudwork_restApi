import { Category } from "@/Category/domain/Category";

const _serializeCategory = (category: Category.Type) => {
    return  {
        'categoryId': category.id.value,
        'categoryName':category.id.value,
        'subCategory':category.id.value,
        // 'title': Category.title,
        // 'description': Category.description,
        // 'budget': Category.budget,
        // 'proposals': Category.proposals,
        // 'expiry': Category.expiry,
        // 'skills': Category.skills,
        // 'experience': Category.experience,
        // 'progress': Category.progress,
        // 'userId': Category.userId,
        // 'startDate': Category.startDate,
        // 'duration': Category.duration,
        // 'qualification': Category.qualification,
        // 'category': Category.category,
        // 'language': Category.language,
        // 'files': Category.files,
        // 'milestones': Category.milestones,
        // 'question': Category.question,
    }
}

const serializer = {
    _serializeCategory(data) {
        if (!data) {
            throw new Error("Expect data to be not undefined nor null");
        }
        if(Array.isArray(data)) {
            return data.map(_serializeCategory);
        }
        return _serializeCategory(data);
    }
}

export { serializer };