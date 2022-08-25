import { DeleteFiles } from "@/job/app/useCases/DeleteFiles";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";

type Dependencies = {
    deletedFiles: DeleteFiles;
}

const { getBody } = makeValidator({

});

const deleteFilesHandler = handler(( {deletedFiles}: Dependencies) => 
    async (req, res) => {
        const {jobId } = req.params;
        let {
            fileId, 
            file
        } = getBody(req);

        await deletedFiles({
            jobId, 
            fileId, 
            file
        });

        res.status(HttpStatus.NO_CONTENT).send();
    });

export { deleteFilesHandler };