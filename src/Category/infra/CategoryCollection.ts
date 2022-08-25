import { Collection, Db } from "mongodb";
import { MUUID } from "uuid-mongodb";

type CategorySchema = {
  _id: MUUID;
  categoryName: string;
  status: "CREATED" | "DELETED";
  subCategory?: string[];
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type CategoryCollection = Collection<CategorySchema>;

const initCategoryCollection = async (db: Db): Promise<CategoryCollection> => {
  const collection: CategoryCollection = db.collection("categories");

  return collection;
};

export { initCategoryCollection };

export type { CategorySchema, CategoryCollection };
