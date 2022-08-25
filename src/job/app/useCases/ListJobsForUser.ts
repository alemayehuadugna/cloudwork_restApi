import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import {
  PaginatedQueryResult,
  QueryHandler,
  SortedPaginatedQuery,
} from "@/_lib/CQRS";
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

type ListJobForUser = QueryHandler<
  SortedPaginatedQuery<JobFilter> & UserId,
  PaginatedQueryResult<Job.Type[]>
>;

const makeListJobForUser =
  ({ jobRepository, messageBundle: { useBundle } }: Dependencies): ListJobForUser =>
  async (payload) => {
    const { pagination, filter, sort, userId } = payload;
    const result = await jobRepository.findForUser({
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
export { makeListJobForUser };
export type { ListJobForUser };
