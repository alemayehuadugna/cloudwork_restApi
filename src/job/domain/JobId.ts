import { AggregateId } from "@/_lib/DDD";

type JobId = AggregateId<string>;
type MilestoneId = AggregateId<string>;

export { JobId, MilestoneId };