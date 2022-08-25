import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  jobRepository: JobRepository;
  messageBundle: MessageBundle;
  clientRepository: ClientRepository;
  freelancerRepository: FreelancerRepository;
};

type DeleteDTO = {
  jobId: string;
  clientId: string | undefined;
  freelancerId: string | undefined;
};

type DeleteJob = ApplicationService<DeleteDTO, void>;

const makeDeleteJob =
  ({
    jobRepository,
    messageBundle: { useBundle },
    clientRepository,
    freelancerRepository,
  }: Dependencies): DeleteJob =>
  async (payload) => {
    var client;
    var freelancer;

    if (payload.clientId) {
      client = await clientRepository.findById(payload.clientId!);
      client = Client.decrementCancelledJobs(client);
      await clientRepository.store(client);
    }
    if (payload.freelancerId) {
      freelancer = await freelancerRepository.findById(payload.freelancerId!);
      freelancer = Freelancer.decrementCancelledJobs(freelancer);
      await freelancerRepository.store(freelancer);
    }

    let job = await jobRepository.findById(payload.jobId);

    if (!job) {
      throw BusinessError.create(useBundle("job.error.notFound", { id: "" }));
    }

    job = Job.markAsDeleted(job);

    await jobRepository.store(job);
  };

export { makeDeleteJob };
export type { DeleteJob };
