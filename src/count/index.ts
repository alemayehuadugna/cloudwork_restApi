import { asFunction } from "awilix";

import { makeModule } from "@/context";
import { makeCountController } from "./interface/router";
import { CountRepository } from "./domain/CountRepository";
import { GetAllCount, makeGetAllCount } from "./app/useCases/GetAllCount";
import { makeMongoCountRepository } from "./infra/CountRepositoryMongo";
import { countMessages } from "./messages";

type CountRegistry = {
	countRepository: CountRepository;
	getAllCount: GetAllCount;
};

const countModule = makeModule(
	"count",
	async ({
		container: { register, build },
		messageBundle: { updateBundle },
	}) => {


		updateBundle(countMessages);

		register({
			countRepository: asFunction(makeMongoCountRepository),
			getAllCount: asFunction(makeGetAllCount),
		})

		build(makeCountController);
	}
);

export { countModule };
export type { CountRegistry };


