import { makeIdProvider } from "@/_lib/IdProvider";
import { ReviewId } from "../domain/ReviewId";

const ReviewIdProvider = makeIdProvider<ReviewId>('ReviewId');

export { ReviewIdProvider };