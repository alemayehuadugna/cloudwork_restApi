import { EditBid } from "@/job/app/useCases/EditBid";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { serializeForEmployee } from "../serializers/serializerForEmployees";

type Dependencies = {
    editBid: EditBid;
}

const { getBody } = makeValidator( {

});

const editBidHandler = handler(
    ({ editBid }: Dependencies ) => 
     async (req, res) => {
         const { jobId } = req.params;
         let {
             freelancerId, 
             budget, 
             hours, 
             coverLetter
         } = getBody(req);

         const result = await editBid({
             jobId, 
             freelancerId, 
             budget, 
             hours, 
             coverLetter
         }); 

         res.status(HttpStatus.OK).json({
             data: serializeForEmployee.serializeForEmployee(result)
         })
     }
);

export { editBidHandler };