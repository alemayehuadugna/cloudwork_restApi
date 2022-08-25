import { asFunction } from "awilix";
import { withMongoProvider } from "@/_lib/MongoProvider";
import { toContainerValues } from "@/_lib/di/containerAdapters";
import {
	initMilestoneCollection,
	MilestoneCollection,
} from "./infrastructure/MilestoneCollection";
import { milestoneMessages } from "./messages";
import { makeMongoMilestoneRepository } from "./infrastructure/MilestoneRepositoryMongo";
import { CreateMilestone, makeCreateMilestone } from "./app/useCases/CreateMilestone";
import { GetMilestone, makeGetMilestone } from "./app/useCases/GetMilestone";
import { ListMilestones, makeListMilestone } from "./app/useCases/ListMilestone";
import { MilestoneRepository } from "./domain/MilestoneRepository";
import { makeModule } from "@/context";
import { makeMilestoneController } from "./interface/routes";
import { DeleteMilestone, makeDeleteMilestone } from "./app/useCases/RemoveMilestone";
import { SearchMilestone, makeSearchMilestone } from "./app/useCases/SearchMilestone";
import { UpdateMilestone, makeUpdateMilestone } from "./app/useCases/UpdateMilestone";

type MilestoneRegistry = {
	milestoneCollection: MilestoneCollection;
	milestoneRepository: MilestoneRepository;
	createMilestone: CreateMilestone;
	getMilestone: GetMilestone;
	listMilestones: ListMilestones;
	deleteMilestone: DeleteMilestone;
    updateMilestone: UpdateMilestone;
    searchMilestone: SearchMilestone;
};

const milestoneModule = makeModule(
	"milestone",
	async ({
		container: { register, build },
		messageBundle: { updateBundle },
	}) => {
		const collections = await build(
			withMongoProvider({
				milestoneCollection: initMilestoneCollection,
			})
		);

		updateBundle(milestoneMessages);

		register({
			...toContainerValues(collections),
			milestoneRepository: asFunction(makeMongoMilestoneRepository),
			createMilestone: asFunction(makeCreateMilestone),
			getMilestone: asFunction(makeGetMilestone),
			listMilestones: asFunction(makeListMilestone),
			deleteMilestone: asFunction(makeDeleteMilestone),
            updateMilestone: asFunction(makeUpdateMilestone),
            searchMilestone: asFunction(makeSearchMilestone)
		});

		build(makeMilestoneController);
	}
);

export { milestoneModule };
export type { MilestoneRegistry };
