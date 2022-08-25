import { MilestoneRepository } from "@/milestone/domain/MilestoneRepository";
import { Milestone } from '@/milestone/domain/Milestone';
import { ApplicationService } from '@/_lib/DDD';

type Dependencies = {
    milestoneRepository: MilestoneRepository;
};

type DeleteMilestone = ApplicationService<string, void>;

const makeDeleteMilestone = 
    ({ milestoneRepository }: Dependencies): DeleteMilestone => 
    async (payload: string) => {
        let milestone = await milestoneRepository.findById(payload);

        milestone = Milestone.markAsDeleted(milestone);

        await milestoneRepository.store(milestone);
    };

export { makeDeleteMilestone };
export type { DeleteMilestone };