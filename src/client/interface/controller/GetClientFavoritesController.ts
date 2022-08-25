import { GetClientFavorites } from "@/client/app/usecase/GetClientFavorites";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makePaginator } from "@/_lib/http/validation/Paginator";
import { Request, Response } from "express";

type Dependencies = {
  getClientFavorites: GetClientFavorites;
};

const {getPagination} = makePaginator();

const getClientFavoritesHandler = handler(
  ({ getClientFavorites }: Dependencies) =>
    async (req: Request, res: Response) => {
      const idObject: any = req.auth.credentials.uid;
      const clientId: string = idObject.value;

      console.log("req from", req.query);

      const pagination = getPagination(req);


      let client = await getClientFavorites({pagination, clientId})

      res.status(HttpStatus.OK).json({ data: client.data, page: client.page });
    }
);

export { getClientFavoritesHandler };
