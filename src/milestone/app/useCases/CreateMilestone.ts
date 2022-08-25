import { Milestone } from "@/milestone/domain/Milestone";
import { MilestoneRepository } from "@/milestone/domain/MilestoneRepository";
import { ApplicationService } from "@/_lib/DDD";
// import { Double } from "mongodb";

type Dependencies = {
	milestoneRepository: MilestoneRepository;
};

type CreateMilestoneDTO = Readonly<{
    Name: string;	
    Budget: Number;
    // Progress:Number;
    // Paid:Boolean;   
    StartDate: Date;
    EndDate: Date;
}>;

type CreateMilestone = ApplicationService<CreateMilestoneDTO, string>;

const makeCreateMilestone =
	({ milestoneRepository }: Dependencies): CreateMilestone =>
	async (payload) => {
		const id = await milestoneRepository.getNextId();

	    const milestone = Milestone.create({
            id,
            Name: payload.Name,
            Budget:  payload.Budget,
            Progress:  0,
            Paid: false,
            StartDate: payload.StartDate,
            EndDate: payload.EndDate,

        });

		await milestoneRepository.store(milestone);

		return id.value;
	};

export { makeCreateMilestone };
export type { CreateMilestone };
