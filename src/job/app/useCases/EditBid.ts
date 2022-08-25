import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
  jobRepository: JobRepository;
};

type EditBidDTO = Readonly<{
  jobId: string;
  freelancerId: string;
  budget: number;
  hours: number;
  coverLetter: string;
}>;

type EditBid = ApplicationService<EditBidDTO, Job.Type>;

const makeEditBid =
  ({ jobRepository }: Dependencies): EditBid =>
  async (payload) => {
    var job = await jobRepository.findById(payload.jobId);

    job.bid.forEach((bid, index) => {
      if (bid.freelancerId == payload.freelancerId) {
        (bid.budget = payload.budget),
        (bid.coverLetter = payload.coverLetter),
        (bid.coverLetter = payload.coverLetter);
        jobRepository.store(job);
      }
    });
    return job;
  };

export { makeEditBid };
export type { EditBid };
