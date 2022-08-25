import { ListClients } from "@/client/app/usecase/ListClients";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import Joi from "types-joi";
import { serializeForEmployee } from "../serializers/serializerForEmployee";

type Dependencies = {
  listClients: ListClients;
};

const { getFilter, getPagination, getSorter } = makePaginator({
  filter: Joi.object({
    joinedBetween: Joi.array().items(Joi.date().iso().required()).min(2).max(2),
    verified: Joi.boolean(),
  }),
});

const listClientHandler = handler(
  ({ listClients }: Dependencies) =>
    async (req, res) => {
      const filter = getFilter(req);
      const pagination = getPagination(req);
      const sort = getSorter(req);
      console.log("filter", filter);

      const clients = await listClients({ filter, pagination, sort });

      res.status(HttpStatus.OK).json({
        data: serializeForEmployee.serializeForEmployee(clients.data),
        page: clients.page,
      });
    }
);

export { listClientHandler };
