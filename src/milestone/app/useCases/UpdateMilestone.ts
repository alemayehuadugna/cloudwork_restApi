import { MilestoneRepository } from "@/milestone/domain/MilestoneRepository";
import { Milestone } from '@/milestone/domain/Milestone';
import { ApplicationService } from '@/_lib/DDD';


type Dependencies = {
    milestoneRepository: MilestoneRepository;
};

type UpdateMilestoneDTO = {
    milestoneId: string;
    Name: string;	
    Budget: Number;
    Progress: Number;
    Paid: Boolean;
    StartDate: Date;
    EndDate: Date;
};

type UpdateMilestone = ApplicationService<UpdateMilestoneDTO, Milestone.Type>;

const makeUpdateMilestone = 
    ({ milestoneRepository }: Dependencies): UpdateMilestone =>
    async (payload) => {

        let milestone = await milestoneRepository.findById(payload. milestoneId);

        milestone = Milestone.updateData(milestone, payload);
        
        return await milestoneRepository.updateMilestone(milestone);
    };

export { makeUpdateMilestone };
export type { UpdateMilestone };


