import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import {
  MilestoneQueryHandler,
  PaginatedQueryResult,
  SortedPaginatedQuery,
} from "@/_lib/CQRS";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  jobRepository: JobRepository;
  messageBundle: MessageBundle;
};

type JobFilter = {
};

type ListMilestoneDTO = Readonly<{
  jobId: string;
  type: string;
}>;

type ListMilestone = MilestoneQueryHandler<
  SortedPaginatedQuery<JobFilter> & ListMilestoneDTO,
  PaginatedQueryResult<Job.Type[]>
>;

const makeListMilestone =
  ({
    jobRepository,
    messageBundle: { useBundle },
  }: Dependencies): ListMilestone =>
  async (payload) => {
    const { jobId, pagination, filter, sort, type } = payload;
    var job = await jobRepository.findById(jobId);
    var result = await jobRepository.findMilestone({
      jobId,
      pagination,
      filter,
      sort,
      type
    });
    console.log("result is: ", result);

    if (!job) {
      throw BusinessError.create(
        useBundle("job.error.notFound", { id: jobId })
      );
    }

    return result;
  };

export { makeListMilestone };
export type { ListMilestone };
