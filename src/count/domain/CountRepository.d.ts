import { Count } from "./Count";


type CountRepository = {
	getAllCounts(): Promise<Count.Type>;
};

export { CountRepository };
