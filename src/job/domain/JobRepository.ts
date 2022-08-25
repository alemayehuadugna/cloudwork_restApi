import { PaginatedQueryResult } from "@/_lib/CQRS";
import { Repository } from "@/_lib/DDD";
import { Job } from "./Job";
import { MilestoneId } from "./JobId";

type JobRepository = Repository<Job.Type> & {

    findById(id: string): Promise<Job.Type>;
  getJob(id: string): Promise<Job.Type[]>;
  getJobForFreelancer(id: string): Promise<Job.Type[]>;
  find({ pagination, filter, sort }): Promise<PaginatedQueryResult<Job.Type[]>>;
  updateProgress(progress): Promise<Job.Type>;
  updateJob(data): Promise<Job.Type>;
  deleteForever(id: string): Promise<void>;
  search({ pagination, filter }): Promise<PaginatedQueryResult<Job.Type[]>>;
  findBid({ jobId }): Promise<Job.Type[]>;
  findMilestone({ jobId, pagination, filter, sort, type }): Promise<PaginatedQueryResult<Job.Type[]>>;
  findForUser({ pagination, filter, sort, userId }): Promise<PaginatedQueryResult<Job.Type[]>>;
  findForFreelancer({ pagination, filter, sort, userId }): Promise<PaginatedQueryResult<Job.Type[]>>;
  findBidForFreelancer({ freelancerId, pagination, filter, sort }): Promise<PaginatedQueryResult<Job.Type[]>>;
	getMilestoneNextId(): Promise<MilestoneId>;
};

export { JobRepository };
