import { ListBid } from "@/job/app/useCases/ListBid";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { serializer } from "../serializers/serialize";

type Dependencies = {
  listBid: ListBid;
};

const listBidHandler = handler(
  ({ listBid }: Dependencies) =>
    async (req, res) => {
      const { jobId } = req.params;

      const result = await listBid({
        jobId,
      });

      res.status(HttpStatus.OK).json({
        data: serializer._serializeJob(result[0]),
      });
      
    }
);

export { listBidHandler };
