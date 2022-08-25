import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  jobRepository: JobRepository;
  messageBundle: MessageBundle;
};

type DeleteBidDTO = Readonly<{
  jobId: string;
  freelancerId: string;
}>;

type DeleteBid = ApplicationService<DeleteBidDTO, Job.Type>;

const makeDeleteBid =
  ({ jobRepository, messageBundle: { useBundle } }: Dependencies): DeleteBid =>
  async (payload) => {
    var job = await jobRepository.findById(payload.jobId);

    job.bid.forEach((bid, index) => {
      if (bid.freelancerId === payload.freelancerId) {
        job.bid.splice(index, 1);
        job.proposals = job.proposals - 1;
        jobRepository.store(job);
      }
    });

    if (!job) {
      throw BusinessError.create(
        useBundle("job.error.notFound", { id: payload.jobId })
      );
    }
    if (job.progress != 'INACTIVE') {
        throw BusinessError.create(
          useBundle("job.error.progress", { id: "" })
        );
      }

    return job;
  };

export { DeleteBid };
export { makeDeleteBid };
