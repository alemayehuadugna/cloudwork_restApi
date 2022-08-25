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
  clientRepository: ClientRepository;
  freelancerRepository: FreelancerRepository;
  messageBundle: MessageBundle;
};

type UpdateProgressDTO = {
  jobId: string;
  progress: string;
  clientId: string | undefined;
  freelancerId: string | undefined;
};

type UpdateProgress = ApplicationService<UpdateProgressDTO, Job.Type>;

const makeUpdateProgress =
  ({
    jobRepository,
    messageBundle: { useBundle },
    clientRepository,
    freelancerRepository,
  }: Dependencies): UpdateProgress =>
  async (payload) => {
    var client;
    var freelancer;

    var count = 0;
    let job = await jobRepository.findById(payload.jobId);

    if (payload.clientId) {
      client = await clientRepository.findById(payload.clientId!);
    }
    if (payload.freelancerId) {
      freelancer = await freelancerRepository.findById(payload.freelancerId!);
    }
    if(payload.clientId && payload.freelancerId && payload.progress == 'INACTIVE') {
      job = Job.updateFreelancerIdAndBid(job, null, [], 0);
      await jobRepository.store(job);
    }

    job.milestones!.forEach((milestone, index) => {
      if (milestone.state == "UnPaid") {
        count++;
      }
    });

    if (!job) {
      throw BusinessError.create(
        useBundle("job.error.notFound", { id: payload.jobId })
      );
    }

    if (count > 0 && payload.progress != 'CANCELLED' && job.progress != 'CANCELLED') {
      throw BusinessError.create(
        useBundle("job.error.milestoneNotCompleted", { id: job.id.value })
      );
    } else {
      if (payload.freelancerId) {
        if (
          payload.progress == "ACTIVE" &&
          !(payload.progress == "ACTIVE" && job.progress == "ACTIVE")
        ) {
          freelancer = Freelancer.incrementOngoingJobs(freelancer);
        }
        if (
          payload.progress == "COMPLETED" &&
          !(payload.progress == "COMPLETED" && job.progress == "COMPLETED")
        ) {
          freelancer = Freelancer.incrementCompletedJobs(freelancer);
        }
        if (
          payload.progress == "CANCELLED" &&
          !(payload.progress == "CANCELLED" && job.progress == "CANCELLED")
        ) {
          freelancer = Freelancer.incrementCancelledJobs(freelancer);
        }

        if (
          job.progress == "ACTIVE" &&
          !(payload.progress == "ACTIVE" && job.progress == "ACTIVE") &&
          client.ongoingJobs > 0
        ) {
          freelancer = Freelancer.decrementOngoingJobs(freelancer);
        }
        if (
          job.progress == "COMPLETED" &&
          !(payload.progress == "COMPLETED" && job.progress == "COMPLETED") &&
          client.completedJobs > 0
        ) {
          freelancer = Freelancer.decrementCompletedJobs(freelancer);
        }
        if (
          job.progress == "CANCELLED" &&
          !(payload.progress == "CANCELLED" && job.progress == "CANCELLED") &&
          client.cancelledJobs > 0
        ) {
          freelancer = Freelancer.decrementCancelledJobs(freelancer);
        }
      }
      if (payload.clientId) {
        if (
          payload.progress == "ACTIVE" &&
          !(payload.progress == "ACTIVE" && job.progress == "ACTIVE")
        ) {
          client = Client.incrementOngoingJobs(client);
        }
        if (
          payload.progress == "COMPLETED" &&
          !(payload.progress == "COMPLETED" && job.progress == "COMPLETED")
        ) {
          client = Client.incrementCompletedJobs(client);
        }
        if (
          payload.progress == "CANCELLED" &&
          !(payload.progress == "CANCELLED" && job.progress == "CANCELLED")
        ) {
          client = Client.incrementCancelledJobs(client);
        }

        if (
          job.progress == "ACTIVE" &&
          !(payload.progress == "ACTIVE" && job.progress == "ACTIVE") &&
          client.ongoingJobs > 0
        ) {
          client = Client.decrementOngoingJobs(client);
        }
        if (
          job.progress == "COMPLETED" &&
          !(payload.progress == "COMPLETED" && job.progress == "COMPLETED") &&
          client.completedJobs > 0
        ) {
          client = Client.decrementCompletedJobs(client);
        }
        if (
          job.progress == "CANCELLED" &&
          !(payload.progress == "CANCELLED" && job.progress == "CANCELLED") &&
          client.cancelledJobs > 0
        ) {
          client = Client.decrementCancelledJobs(client);
        }
      }

      if (payload.clientId) {
        await clientRepository.store(client);
      }
      if (payload.freelancerId) {
        await freelancerRepository.store(freelancer);
      }
      job = Job.updateProgressState(job, payload.progress);
      return await jobRepository.updateProgress(job);
    }
  };

export { makeUpdateProgress };
export type { UpdateProgress };
