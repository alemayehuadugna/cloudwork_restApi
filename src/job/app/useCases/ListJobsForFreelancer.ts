import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { PaginatedQueryResult, QueryHandler, SortedPaginatedQuery } from "@/_lib/CQRS";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  jobRepository: JobRepository;
  messageBundle: MessageBundle;
};

type JobFilter = {
  progress: "COMPLETED" | "ACTIVE" | "INACTIVE" | "DELETED" | "CANCELLED";
};

type UserId = Readonly<{
  userId: string;
}>;

type ListJobForFreelancer = QueryHandler<
  SortedPaginatedQuery<JobFilter> & UserId,
  PaginatedQueryResult<Job.Type[]>
>;

const makeListJobForFreelancer =
  ({ jobRepository, messageBundle: { useBundle } }: Dependencies): ListJobForFreelancer =>
  async (payload) => {
    const { pagination, filter, sort, userId } = payload;
    const result = await jobRepository.findForFreelancer({
      userId,
      pagination,
      filter,
      sort,
    });

    if (!result) {
      throw BusinessError.create(useBundle("job.error.notFound", { id: "" }));
    }

    return result;
  };
export { makeListJobForFreelancer };
export type { ListJobForFreelancer };
