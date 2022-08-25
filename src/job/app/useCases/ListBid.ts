import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  jobRepository: JobRepository;
  messageBundle: MessageBundle;
};

type ListBidDTO = Readonly<{
  jobId: string;
}>;

type ListBid = ApplicationService<ListBidDTO, Job.Type[]>;

const makeListBid =
  ({ jobRepository, messageBundle: { useBundle } }: Dependencies): ListBid =>
  async (payload) => {
    const { jobId } = payload;
    var result = await jobRepository.findBid({
      jobId,
    });

    if (!result) {
      throw BusinessError.create(
        useBundle("job.error.notFound", { id: jobId })
      );
    }

    return result;
  };

export { makeListBid };
export type { ListBid };
