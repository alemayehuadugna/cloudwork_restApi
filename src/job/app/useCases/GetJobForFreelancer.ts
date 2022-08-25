import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  jobRepository: JobRepository;
  messageBundle: MessageBundle;
};

type GetJobForFreelancerDTO = {
  jobId: string;
  freelancerId: string;
};

type GetJobForFreelancer = ApplicationService<string, Job.Type[]>;

const makeGetJobForFreelancer =
  ({
    jobRepository,
    messageBundle: { useBundle },
  }: Dependencies): GetJobForFreelancer =>
  async (payload) => {
    let job = await jobRepository.getJobForFreelancer(payload);

    if (!job) {
      throw BusinessError.create(
        useBundle("job.error.notFound", { id: payload })
      );
    }
    return job;
  };

export { makeGetJobForFreelancer };
export type { GetJobForFreelancer };
