import { makeIdProvider } from "@/_lib/IdProvider";
import { JobId, MilestoneId } from "../domain/JobId";

const JobIdProvider = makeIdProvider<JobId>("JobId");
const MilestoneIdProvider = makeIdProvider<MilestoneId>("MilestoneId");

export { JobIdProvider, MilestoneIdProvider };