import { DownloadFile } from "@/_sharedKernel/app/usecase/file/DownloadFile"
import { handler } from '@/_lib/http/handler';
import { MessageBundle } from "@/messages";



type Dependencies = {
	downloadFile: DownloadFile;
	messageBundle: MessageBundle;
}

const downloadFileHandler = handler(({ downloadFile }: Dependencies) =>
	async (req, res) => {
		let params = req.params;
		const userName = params.userName;
		const fileName = params.fileName;
		const subfolder = params.subfolder;

		console.log(`${subfolder} - ${userName} - ${fileName}`);
		res.download(`file_storage/${subfolder}/${userName}/${fileName}`, onError);
		function onError(err) {
			if (err) {
				res.sendStatus(404);
			}
		}

	})

export { downloadFileHandler };