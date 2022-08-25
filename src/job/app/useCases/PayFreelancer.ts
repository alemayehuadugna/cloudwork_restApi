import { JobRepository } from "@/job/domain/JobRepository";
import { MessageBundle } from "@/messages";
import { Wallet } from "@/wallet/domain/Wallet";
import { WalletRepository } from "@/wallet/domain/WalletRepository";
import { ApplicationService } from "@/_lib/DDD";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import { from } from "uuid-mongodb";

type Dependencies = {
  jobRepository: JobRepository;
  walletRepository: WalletRepository;
  messageBundle: MessageBundle;
};

type PayFreelancerDTO = {
  freelancerId: string;
  clientId: string;
  jobId: string;
  amount: number;
  milestoneId: string;
};

type PayFreelancer = ApplicationService<PayFreelancerDTO, String>;

const makePayFreelancer =
  ({
    jobRepository,
    walletRepository,
    messageBundle: { useBundle },
  }: Dependencies): PayFreelancer =>
  async (payload) => {
    var job = await jobRepository.findById(payload.jobId);
    var tempMilestone;
    job.milestones!.forEach((milestone, index) => {
      if (milestone.milestoneId == payload.milestoneId) {
        tempMilestone = {
          milestoneId: from(milestone.milestoneId),
          name: milestone.name,
          budget: milestone.budget,
          startDate: milestone.startDate,
          endDate: milestone.endDate,
          description: milestone.description,
          state: "Paid",
          datePaid: new Date()
        };
        job.milestones![index] = tempMilestone;
      }
    });

    var deposit;
    var deduct;
    var clientWallet = await walletRepository.findByUserId(payload.clientId);
    var freelancerWallet = await walletRepository.findByUserId(
      payload.freelancerId
      );

    if (payload.amount > clientWallet.invested) {
      throw BusinessError.create(
        useBundle("job.error.insufficientBalance", { id: "" })
      );
    }

    if (!clientWallet || !freelancerWallet) {
      throw BusinessError.create(
        useBundle("job.error.walletNotFound", { id: "" })
      );
    } else {
      if (payload.amount < clientWallet.invested) {
        payload.amount = payload.amount - payload.amount * 0.05;
        deduct = Wallet.deductInvestment(clientWallet, payload.amount);
        deposit = Wallet.deposit(freelancerWallet, payload.amount);

        await walletRepository.store(deduct);
        await walletRepository.store(deposit);
        await jobRepository.store(job);
      }
    }

    if (!job) {
      throw BusinessError.create(
        useBundle("job.error.notFound", { id: payload.jobId })
      );
    }

    return job.id.value;
  };

export { makePayFreelancer };
export type { PayFreelancer };
