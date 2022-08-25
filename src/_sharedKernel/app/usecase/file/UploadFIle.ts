import { FileRepository } from '@/_sharedKernel/domain/repo/FileRepository';
import { ApplicationService } from '@/_lib/DDD';

type Dependencies = {
	fileRepository: FileRepository;
}

type UploadFileDTO = Readonly<{
	file?: Express.Multer.File;
	userName: string;
}>;

type UploadFile = ApplicationService<UploadFileDTO, string>;

const makeUploadFile = ({ fileRepository }: Dependencies): UploadFile =>
	async (payload)  => {
		// console.log('uploadFile in usecase', payload.file);
		// console.log('uploadFile in usecase', payload.userName);

		const file = payload.file;
		const userName = payload.userName;
		
		const result = await fileRepository.save({ file, userName })
		return result;
	};

export { makeUploadFile };
export type { UploadFile };