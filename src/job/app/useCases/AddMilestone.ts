import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import { from } from "uuid-mongodb";

type Dependencies = {
  jobRepository: JobRepository;
  messageBundle: MessageBundle;
};

type AddMilestoneDTO = Readonly<{
  jobId: string;
  name: string;
  budget: number;
  newStartDate: Date;
  newEndDate: Date;
  description: string;
}>;

type AddMilestone = ApplicationService<AddMilestoneDTO, Job.Type>;

const makeAddMilestone =
  ({
    jobRepository,
    messageBundle: { useBundle },
  }: Dependencies): AddMilestone =>
  async (payload) => {
    const id = await jobRepository.getMilestoneNextId();
    var job = await jobRepository.findById(payload.jobId);

    var temp: any = {
      milestoneId: from(id.value),
      name: payload.name,
      budget: payload.budget,
      startDate: payload.newStartDate,
      endDate: payload.newEndDate,
      description: payload.description,
      state: "UnPaid",
      datePaid: null,
    };
    var total = 0;
    job.milestones!.forEach((milestone, index) => {
      total += milestone.budget;
    });

    if (payload.budget > job.budget || total + payload.budget > job.budget) {
      throw BusinessError.create(
        useBundle("job.error.insufficientBalance", { id: payload.jobId })
      );
    }
    var data = job.milestones!.concat(temp);
    job = Job.addMilestone(job, data);

    if (!job) {
      throw BusinessError.create(
        useBundle("job.error.notFound", { id: payload.jobId })
      );
    }

    await jobRepository.store(job);

    return job;
  };

export { makeAddMilestone };
export type { AddMilestone };
