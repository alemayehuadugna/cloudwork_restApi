import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  jobRepository: JobRepository;
  freelancerRepository: FreelancerRepository;
  messageBundle: MessageBundle;
};

type AddBidDTO = Readonly<{
  jobId: string;
  freelancerId: string;
  budget: number;
  hours: number;
  coverLetter: string;
  isTermsAndConditionAgreed: boolean;
}>;

type AddBid = ApplicationService<AddBidDTO, Job.Type>;

const makeAddBid =
  ({
    jobRepository,
    freelancerRepository,
    messageBundle: { useBundle },
  }: Dependencies): AddBid =>
  async (payload) => {
    var job = await jobRepository.findById(payload.jobId);
    var freelancer = await freelancerRepository.findById(payload.freelancerId);

    if (!job) {
      throw BusinessError.create(
        useBundle("job.error.notFound", { id: payload.jobId })
      );
    }
    if (!payload.isTermsAndConditionAgreed) {
      throw BusinessError.create(
        useBundle("job.error.termsNoAgreed", {
          isTermsAndConditionAgreed: false,
        })
      );
    }
    if (job.progress != "INACTIVE") {
      throw BusinessError.create(useBundle("job.error.progress", { id: "" }));
    }

    if (!freelancer) {
      throw BusinessError.create(
        useBundle("job.error.freelancerNotFound", { id: payload.freelancerId })
      );
    }

    var count = 0;
    var repeatedFreelancerId = "";
    var proposals = job.proposals;
    if (freelancer != null && job != null && job.progress == "INACTIVE") {
      if (job.bid.length == 0) {
        proposals += 1;
        var temp = {
          freelancerId: payload.freelancerId,
          budget: payload.budget,
          hours: payload.hours,
          coverLetter: payload.coverLetter,
          isTermsAndConditionAgreed: payload.isTermsAndConditionAgreed,
          createdAt: new Date(),
        };
        var data = job.bid.concat(temp);

        job = Job.addBid(job, data, proposals);
      } else if (job.bid.length > 0) {
        job.bid.forEach((bid, index) => {
          if (bid.freelancerId == payload.freelancerId && (job.id.value == payload.jobId)) {
            // repeatedFreelancerId = payload.freelancerId;
            count++;
          }
        });
        if (count == 0) {
          proposals += 1;
          var temp = {
            freelancerId: payload.freelancerId,
            budget: payload.budget,
            hours: payload.hours,
            coverLetter: payload.coverLetter,
            isTermsAndConditionAgreed: payload.isTermsAndConditionAgreed,
            createdAt: new Date(),
          };
          var data = job.bid.concat(temp);

          job = Job.addBid(job, data, proposals);
          job = Job.updateBudget(job, payload.budget);
        } else {
          throw BusinessError.create(useBundle("job.error.bid", { id: "" }));
        }
      }

      await jobRepository.store(job);
    }
    // if (repeatedFreelancerId == payload.freelancerId) {
    //   throw BusinessError.create(
    //     useBundle("job.error.bid", { id: "" })
    //   );
    // }

    return job;
  };
export { makeAddBid };
export type { AddBid };
