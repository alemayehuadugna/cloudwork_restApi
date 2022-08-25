import { Count } from "@/count/domain/Count";
import { CountRepository } from "@/count/domain/CountRepository";
import { ApplicationService } from "@/_lib/DDD";

type Dependencies = {
	countRepository: CountRepository;
};

type GetAllCount = ApplicationService<void, Count.Type>;

const makeGetAllCount =
	({ countRepository }: Dependencies): GetAllCount =>
		async () => {
			let counts = await countRepository.getAllCounts();

			return counts;
		};

export { makeGetAllCount };
export type { GetAllCount };
