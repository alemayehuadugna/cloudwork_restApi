import { serializeForEmployee } from "@/client/interface/serializers/serializerForEmployee";
import { DeleteBid } from "@/job/app/useCases/DeleteBid";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";

type Dependencies = {
    deleteBid: DeleteBid;
};

const { getBody } = makeValidator({

});

const deleteBidHandler = handler(
    ({ deleteBid }: Dependencies) => 
    async (req, res) => {
        const { jobId } = req.params;

        let {
            freelancerId
        } = getBody(req);

        const result = await deleteBid({
            jobId, 
            freelancerId
        });

        res.status(HttpStatus.OK).json({
            data: serializeForEmployee.serializeForEmployee(result)
        })
    }
);

export { deleteBidHandler };