import { ListMilestones } from "@/milestone/app/useCases/ListMilestone";
import { handler } from "@/_lib/http/handler";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import Joi from "types-joi";



type Dependencies = {
	listMilestones: ListMilestones;
};

const { getFilter, getPagination, getSorter  } = makePaginator({
	   filter: Joi.object({
		Name: Joi.string(),
	  }),
});

const listMilestonesHandler = handler(
	({ listMilestones }: Dependencies) =>
		async (req, res) => {
			const filter = getFilter(req);
            const pagination = getPagination(req);
            const sort = getSorter(req);
			
			const milestones = await listMilestones({ 
				filter,
                sort,
				pagination,
			 });

			res.json(milestones);
		}
);

export { listMilestonesHandler };
