import { makeIdProvider } from "@/_lib/IdProvider";
import { CategoryId } from "../domain/CategoryId";

const CategoryIdProvider = makeIdProvider<CategoryId>("CategoryId");

export {CategoryIdProvider};