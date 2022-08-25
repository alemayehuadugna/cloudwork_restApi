import { Milestone } from "@/milestone/domain/Milestone";
import { MilestoneRepository } from "@/milestone/domain/MilestoneRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
	milestoneRepository: MilestoneRepository;
};

type GetMilestone = ApplicationService<string, Milestone.Type>;

const makeGetMilestone =
	({ milestoneRepository }: Dependencies): GetMilestone =>
	async (payload: string) => {
		let milestone = await milestoneRepository.findById(payload);

		return milestone;
	};

export { makeGetMilestone };
export type { GetMilestone };
