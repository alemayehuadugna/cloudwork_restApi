import { Collection, Db, ObjectId } from "mongodb";
import { MUUID } from "uuid-mongodb";

type FileSchema = {
  id: ObjectId;
  title: string; 
  description: string;
  link: string;
  uploader: string; 
  uploadDate: Date; 
  size: number;
}

type BidSchema = {
  freelancerId: MUUID, 
  budget: number;
  hours: number;
  coverLetter: string;
  isTermsAndConditionAgreed: boolean;
  createdAt: Date;
}

type MilestoneSchema = {
  milestoneId: MUUID; 
  name: string;
  budget: number;
  startDate: Date;
  endDate: Date;
  description: string;
  state: string;
  datePaid: Date;
}

type JobSchema = {
  _id: MUUID;
  clientId: MUUID;
  freelancerId: MUUID | undefined;
  title: string;
  description: string;
  budget: number;
  proposals: number;
  expiry?: Date;
  skills?: string[];
  links?: String[];
  experience: string;
  startDate?: Date;
  duration: number;
  qualification?: string;
  category: string;
  lang?: string;
  question?: string;
  files: FileSchema[];
  milestones?: MilestoneSchema[];
  attachments?: string[];
  bid: BidSchema[];
  progress: "COMPLETED" | "ACTIVE" | "INACTIVE" | "DELETED" | "CANCELLED";
  deleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  version: number;
};

type JobCollection = Collection<JobSchema>;

const initJobCollection = async function (
    db: Db
): Promise<JobCollection> {
  const collection: JobCollection = db.collection("jobs");

  await collection.createIndex({ _id: 1, deleted: 1 });
  await collection.createIndex({ clientId: 1, deleted: 1});
  await collection.createIndex(
    {title: "text" }
  );

  return collection;
};

export { initJobCollection };
export type { JobSchema, JobCollection };
