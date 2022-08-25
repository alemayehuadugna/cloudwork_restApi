import { SearchMilestone } from "@/milestone/app/useCases/SearchMilestone";
import { handler } from "@/_lib/http/handler";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import Joi from "types-joi";

type Dependencies = {
  searchMilestone: SearchMilestone;
};

const {getFilter, getPagination } = makePaginator({
    filter: Joi.object({
        searchItem: Joi.string(),
    }),
});

const searchMilestoneHandler = handler(
  ({ searchMilestone }: Dependencies) =>
    async (req, res) => {
      const pagination = getPagination(req);
      const filter = getFilter(req);

      const milestones = await searchMilestone({
         filter,
         pagination
      });

      res.json(milestones);
    }
);

export { searchMilestoneHandler };
