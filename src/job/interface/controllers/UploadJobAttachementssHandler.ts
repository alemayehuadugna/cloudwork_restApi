import { UploadJobFiles } from "@/job/app/useCases/UploadJobAttachements";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";

type Dependencies = {
	uploadJobFiles: UploadJobFiles;
}


const uploadJobFilesHandler = handler(({ uploadJobFiles }: Dependencies) =>
	async (req, res) => {
		const { jobId } = req.params;
		let files: any = req.files;

		const uploadJobFilesUrl = await uploadJobFiles({ files, jobId });

		res.status(HttpStatus.ACCEPTED).json({ data: { uploadJobFilesUrl } })
	});

export { uploadJobFilesHandler };