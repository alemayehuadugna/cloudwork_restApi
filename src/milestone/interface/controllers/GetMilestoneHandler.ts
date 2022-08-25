import { GetMilestone } from "@/milestone/app/useCases/GetMilestone";
import { handler } from "@/_lib/http/handler";
import { Request, Response } from "express";

type Dependencies = {
	getMilestone: GetMilestone;
};

const getMilestoneHandler = handler(
	({ getMilestone }: Dependencies) =>
		async (req: Request, res: Response) => {
			const milestoneId: any = req.auth.credentials.uid;

			const milestone = await getMilestone(milestoneId.value);

			res.json(milestone);
		}
);

export { getMilestoneHandler };