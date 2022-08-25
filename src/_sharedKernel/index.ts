import { makeUploadFile, UploadFile } from "./app/usecase/file/UploadFIle";
import { FileRepository } from "./domain/repo/FileRepository";
import { FileStorage, initFileStorage } from "./infra/repository/FileStorage"
import { makeModule } from '@/context';
import { asFunction } from 'awilix';
import { makeLocalFileRepository } from "./infra/repository/FileRepositoryLocal";
import { makeFileController } from "./interface/router";
import { DownloadFile, makeDownloadFile } from '@/_sharedKernel/app/usecase/file/DownloadFile';
import { fileMessages } from '@/_sharedKernel/fileMessages';

type FileRegistry = {
	fileStorage: FileStorage;
	fileRepository: FileRepository;
	uploadFile: UploadFile;
	downloadFile: DownloadFile;
}

const fileModule = makeModule(
	'file',
	async ({
		container: { register, build },
		messageBundle: { updateBundle },
	}) => {

		updateBundle(fileMessages);

		register({
			fileStorage: asFunction(initFileStorage),
			fileRepository: asFunction(makeLocalFileRepository),
			uploadFile: asFunction(makeUploadFile),
			downloadFile: asFunction(makeDownloadFile),
		})

		build(makeFileController);
	}
);

export { fileModule };
export type { FileRegistry };