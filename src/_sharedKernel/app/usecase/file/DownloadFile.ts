import { ApplicationService } from "@/_lib/DDD";
import { FileRepository } from "@/_sharedKernel/domain/repo/FileRepository";

type Dependencies = {
	fileRepository: FileRepository;
}

type DownloadFileDTO = Readonly<{
	userName: string;
	fileName: string;
}>;

type DownloadFile = ApplicationService<DownloadFileDTO, any>;

const makeDownloadFile = ({ fileRepository }: Dependencies): DownloadFile =>
	async (payload) => {
		const userName = payload.userName;
		const fileName = payload.fileName;

		const result = await fileRepository.read({ userName, fileName });
		return result;
	}

export { makeDownloadFile };
export type { DownloadFile };
