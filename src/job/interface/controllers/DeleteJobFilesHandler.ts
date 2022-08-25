import { DeleteJobFiles } from "@/job/app/useCases/DeleteJobFiles";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";

type Dependencies = {
    deletedJobFiles: DeleteJobFiles; 
}

const { getBody } = makeValidator({

});

const deleteJobFilesHandler = handler(({ deletedJobFiles }: Dependencies) => 
  async (req, res) => {
      const { jobId } = req.params;
      let {
          file
      } = getBody(req);

      await deletedJobFiles({
          jobId, 
          file
      });

      res.status(HttpStatus.NO_CONTENT).send();
  }
);

export { deleteJobFilesHandler };