import { Collection, Db } from "mongodb";
import { MUUID } from "uuid-mongodb";

type MilestoneSchema = {
  _id: MUUID;
  Name: string;
  Budget: Number;
  Progress: Number;
  Paid: Boolean;
  state: 'ACTIVE' | 'DEACTIVATED' | 'DELETED';
  StartDate: Date;
  EndDate: Date;
  version:Number;
  
};

type MilestoneCollection = Collection<MilestoneSchema>;

const initMilestoneCollection = async function (db: Db): Promise<MilestoneCollection> {
  const collection: MilestoneCollection = db.collection("milestones");

  await collection.createIndex({ _id:1, deleted: 1});
  return collection;
};

export { initMilestoneCollection };
export type { MilestoneSchema, MilestoneCollection };
