import { makeIdProvider } from "@/_lib/IdProvider";
import { FreelancerId } from "../domain/FreelancerId";

const FreelancerIdProvider = makeIdProvider<FreelancerId>("FreelancerId");

export { FreelancerIdProvider };
