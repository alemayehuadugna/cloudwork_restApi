import { makeIdProvider } from "@/_lib/IdProvider";
import { MilestoneId } from "../domain/MilestoneId";

const MilestoneIdProvider = makeIdProvider<MilestoneId>("MilestoneId");

export { MilestoneIdProvider };