import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  jobRepository: JobRepository;
  messageBundle: MessageBundle;
};

type CreateJobDTO = Readonly<{
  clientId: string;
  title: string;   
  category: string;
  language?: string;
  budget: number;
  duration: number;
  newDate: Date;
  links?: String[];
  description: string;
  skills?: any[];
}>;

type CreateJob = ApplicationService<CreateJobDTO, Job.Type>;

const makeCreateJob =
  ({ jobRepository, messageBundle: {useBundle} }: Dependencies): CreateJob =>
  async (payload) => {
    const id = await jobRepository.getNextId();

    var job = Job.create({
      id,
      clientId: payload.clientId,
      title: payload.title,
      category: payload.category,
      language: payload.language,
      budget: payload.budget,
      duration: payload.duration,
      expiry: payload.newDate,
      links: payload.links,
      description: payload.description,
      skills: payload.skills,
    });

    await jobRepository.store(job);

    job = await jobRepository.findById(id.value);
    if (!job) {
      throw BusinessError.create(
        useBundle("job.error.notFound", { id: id.value })
      );
    }

    return job;
  };
export { makeCreateJob };
export type { CreateJob };
