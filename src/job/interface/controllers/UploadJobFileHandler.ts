import { UploadFiles } from "@/job/app/useCases/UploadJobFile";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
  uploadFiles: UploadFiles;
};

const { getBody } = makeValidator({
  body: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    uploader: Joi.string().required(),
  }).required(),
});

const uploadFilesHandler = handler(
  ({ uploadFiles }: Dependencies) =>
    async (req, res) => {
      const { jobId } = req.params;
      let file: any = req.file;
	  const size = file.size;
      let { title, description, uploader } = getBody(req);

      const uploadJobFilesUrl = await uploadFiles({
        file,
        jobId,
        title,
        description,
        uploader,
		size,
      });

      res.status(HttpStatus.ACCEPTED).json({ data: { uploadJobFilesUrl } });
    }
);

export { uploadFilesHandler };
