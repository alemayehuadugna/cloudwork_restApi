import { Collection, Db } from "mongodb";
import { MUUID } from "uuid-mongodb";

type FeedbackSchema = {
  _id: MUUID;
  firstName: string;
  lastName: string;
  message: string;
  title: string;
  status: "CREATED" | "DELETED";
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type FeedbackCollection = Collection<FeedbackSchema>;

const initFeedbackCollection = async (db: Db): Promise<FeedbackCollection> => {
  const collection: FeedbackCollection = db.collection("feedbacks");

  return collection;
};

export { initFeedbackCollection };

export type { FeedbackSchema, FeedbackCollection };
