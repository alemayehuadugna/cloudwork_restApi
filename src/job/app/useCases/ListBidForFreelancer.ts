import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import {
  PaginatedQueryResult,
  QueryHandler,
  SortedPaginatedQuery,
} from "@/_lib/CQRS";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  jobRepository: JobRepository;
  messageBundle: MessageBundle;
};

type JobFilter = {
  progress: "COMPLETED" | "ACTIVE" | "INACTIVE" | "DELETED" | "CANCELLED";
};

type FreelancerId = Readonly<{
  freelancerId: string;
}>;


type ListBidForFreelancer = QueryHandler<
SortedPaginatedQuery<JobFilter> & FreelancerId,
PaginatedQueryResult<Job.Type[]>
>;

const makeListBidForFreelancer =
  ({
    jobRepository,
    messageBundle: { useBundle },
  }: Dependencies): ListBidForFreelancer =>
  async (payload) => {
    const { pagination, filter, sort, freelancerId } = payload;
    var result = await jobRepository.findBidForFreelancer({
      freelancerId,
      pagination,
      filter,
      sort,
    });

    if (!result) {
      throw BusinessError.create(
        useBundle("job.error.notFound", { id: freelancerId })
      );
    }

    return result;
  };

export { makeListBidForFreelancer };
export type { ListBidForFreelancer };
