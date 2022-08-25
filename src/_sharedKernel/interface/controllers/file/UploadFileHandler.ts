import { UploadFile } from "@/_sharedKernel/app/usecase/file/UploadFIle"
import { handler } from '@/_lib/http/handler';
import { Request, Response } from "express";
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
	uploadFile: UploadFile;
}

const uploadFileHandler = handler(({ uploadFile }: Dependencies) =>
	async (req: Request, res: Response) => {

		let file: Express.Multer.File | undefined = req.file;
		let userName = req.body.userName;

		const fileName = await uploadFile({ file, userName });

		res.status(HttpStatus.ACCEPTED).json({ data: { fileName: fileName } });
	});

export { uploadFileHandler };