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

type ListJob = QueryHandler<
  SortedPaginatedQuery<JobFilter>,
  PaginatedQueryResult<Job.Type[]>
>;

const makeListJob =
  ({ jobRepository, messageBundle: { useBundle } }: Dependencies): ListJob =>
  async (payload) => {
    const { pagination, filter, sort } = payload;
    const result = await jobRepository.find({
      pagination,
      filter,
      sort,
    });

    if (!result) {
      throw BusinessError.create(useBundle("job.error.notFound", { id: "" }));
    }

    return result;
  };
export { makeListJob };
export type { ListJob };
