import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  jobRepository: JobRepository;
  messageBundle: MessageBundle;
};

type GetJob = ApplicationService<string, Job.Type[]>;

const makeGetJob =
  ({ jobRepository, messageBundle: { useBundle } }: Dependencies): GetJob =>
  async (payload: string) => {
    let job = await jobRepository.getJob(payload);

    if (!job) {
      throw BusinessError.create(
        useBundle("job.error.notFound", { id: payload })
      );
    }
    return job;
  };

export { makeGetJob };
export type { GetJob };
