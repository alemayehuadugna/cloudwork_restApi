import { makeIdProvider } from "@/_lib/IdProvider";
import { FeedbackId } from "../domain/FeedbackId";

const FeedbackIdProvider = makeIdProvider<FeedbackId>("FeedbackId");

export {FeedbackIdProvider};