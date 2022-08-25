import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { Freelancer } from "@/freelancer/domain/Freelancer";
import { FreelancerRepository } from "@/freelancer/domain/FreelancerRepository";
import { Job } from "@/job/domain/Job";
import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { Wallet } from "@/wallet/domain/Wallet";
import { WalletRepository } from "@/wallet/domain/WalletRepository";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";

type Dependencies = {
  jobRepository: JobRepository;
  freelancerRepository: FreelancerRepository;
  clientRepository: ClientRepository;
  walletRepository: WalletRepository;
  messageBundle: MessageBundle;
};

type HireFreelancerDTO = Readonly<{
  jobId: string;
  freelancerId: string;
  clientId: string;
  amount: number;
}>;

type HireFreelancer = ApplicationService<HireFreelancerDTO, String>;

const makeHireFreelancer =
  ({
    jobRepository,
    freelancerRepository,
    clientRepository,
    walletRepository,
    messageBundle: { useBundle },
  }: Dependencies): HireFreelancer =>
  async (payload) => {
    var invested;
    var job = await jobRepository.findById(payload.jobId);
    var freelancer = await freelancerRepository.findById(payload.freelancerId);
    var client = await clientRepository.findById(payload.clientId);
    var clientWallet = await walletRepository.findByUserId(payload.clientId);

    if (!job) {
      throw BusinessError.create(
        useBundle("job.error.notFound", { id: payload.jobId })
      );
    }

    if (!freelancer) {
      throw BusinessError.create(
        useBundle("job.error.freelancerNotFound", { id: payload.freelancerId })
      );
    }

    if (!client) {
      throw BusinessError.create(
        useBundle("job.error.clientNotFound", { id: payload.clientId })
      );
    }

    if (payload.freelancerId == job.freelancerId) {
      throw BusinessError.create(
        useBundle("job.error.userAlreadyExists", { id: payload.freelancerId })
      );
    }
    if (payload.amount >= clientWallet.balance) {
      throw BusinessError.create(
        useBundle("job.error.insufficientBalance", { id: "" })
      );
    }

    if (job.freelancerId == undefined || freelancer != null) {
      invested = Wallet.invest(clientWallet, payload.amount);
      await walletRepository.store(invested);
      job = Job.hireFreelancer(job, payload.freelancerId, new Date());
      job = Job.updateBudget(job, payload.amount);
      await jobRepository.store(job);

      // increment job number for both client and freelancer
      freelancer = Freelancer.incrementOngoingJobs(freelancer);
      await freelancerRepository.store(freelancer);
      client = Client.incrementOngoingJobs(client);
      await clientRepository.store(client);
    }

    return job.id.value;
  };

export { makeHireFreelancer };
export type { HireFreelancer };
