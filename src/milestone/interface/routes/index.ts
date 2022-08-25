// import { Scope } from "@/auth/interface/controllers/AccessScopeHandler";
// import { verifyTokenHandler } from "@/auth/interface/controllers/VerifyTokenHandler";
import { Router } from "express";
import { createMilestoneHandler } from "../controllers/CreateMilestoneHandler";
import { getMilestoneHandler } from "../controllers/GetMilestoneHandler";
import { listMilestonesHandler } from "../controllers/ListMilestonesHandler";
import { deleteMilestoneHandler } from "@/milestone/interface/controllers/DeleteMilestoneHandler";
import { updateMilestoneHandler } from "../controllers/UpdateMilestoneHandler";
import { searchMilestoneHandler } from "../controllers/SearchMilestonesHandler";
type Dependencies = {
	apiRouter: Router;
};

const makeMilestoneController = ({ apiRouter }: Dependencies) => {
	const router = Router();

	router.get("/milestones", listMilestonesHandler);
	router.post("/milestones", createMilestoneHandler);
	router.get("/milestones/:milestoneId", getMilestoneHandler);
	router.delete('/milestones/:milestoneId', deleteMilestoneHandler);
    router.patch('/update/milestones/:milestoneId', updateMilestoneHandler);
    router.get('/search/milestones', searchMilestoneHandler);

	apiRouter.use(router);
};

export { makeMilestoneController };
