import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  jobRepository: JobRepository;
  messageBundle: MessageBundle;
};

type UpdateJobDTO = {
  jobId: string;
  clientId: string;
  title: string;
  category: string;
  language?: string;
  budget: number;
  duration: number;
  skills?: any[];
  newDate?: Date;
  links?: string[];
  description: string;
};

type UpdateJob = ApplicationService<UpdateJobDTO, Job.Type>;

const makeUpdateJob =
  ({ jobRepository, messageBundle: { useBundle } }: Dependencies): UpdateJob =>
  async (payload) => {
    var holder = {
      jobId: payload.jobId,
      clientId: payload.clientId,
      title: payload.title,
      category: payload.category,
      language: payload.language,
      budget: payload.budget,
      duration: payload.duration,
      skills: payload.skills,
      expiry: payload.newDate,
      links: payload.links,
      description: payload.description,
    };

    let job = await jobRepository.findById(holder.jobId);

    job = Job.updateJobData(job, holder);

    var result = jobRepository.updateJob(job);
    if (!result) {
      throw BusinessError.create(
        useBundle("job.error.notUpdated", { id: job.id.value })
      );
    }

    return result;
  };

export { makeUpdateJob };
export type { UpdateJob };
