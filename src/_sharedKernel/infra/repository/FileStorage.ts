import { MessageBundle } from "@/messages";
import { BusinessError } from "@/_sharedKernel/domain/error/BusinessError";
import fs from "fs";
import { Logger } from "pino";

type Dependencies = {
	logger: Logger;
	messageBundle: MessageBundle;
};

type FileStorage = {
	save(file: any, userName: string, fileName: string, random: number, folder: string): Promise<string>;
	saveFiles(file: any, id: string, fileName: string, random: number, folder: string): Promise<string>;
	remove(path: string, fileName: string): Promise<boolean>;
	read(userName: string, fileName: string): fs.ReadStream;
}

export type CustomFileResult = {
	file: any;
}

const initFileStorage = function ({ logger, messageBundle: { getMessage, useBundle } }: Dependencies): FileStorage {
	var fileBaseDir: string = 'file_storage/';
	var fileBaseUrl: string = 'http://localhost:3000/api/files/';
	return ({
		async save(file: Express.Multer.File, userName: string, fileName: string, random: number, folder: string): Promise<string> {
			fileName = random + "_" + fileName;
			try {
				fs.mkdirSync(fileBaseDir + folder + "/" + userName + "/", { recursive: true });
			} catch (e) {
				throw BusinessError.create(
					useBundle('file.error.noFileOrDir', { path: userName + "/" })
				);
			}
			console.log("file: ", file);

			fs.writeFile(fileBaseDir + folder + "/" + userName + "/" + fileName, file.buffer, function (error) {
				if (error) {
					throw BusinessError.create(
						useBundle('file.error.writeError', { path: userName + "/" + fileName })
					);
				}
				logger.info(
					getMessage('file.created', { path: fileBaseDir + folder + "/" + userName + "/" + fileName })
				);
			});
			return fileBaseUrl + folder + "/" + userName + "/" + fileName;
		},
		async remove(id: any): Promise<boolean> {
			return true;
		},
		read(userName: string, fileName: string) {
			const path = fileBaseDir + userName + "/" + fileName;
			
			var file: fs.ReadStream = fs.createReadStream(path);
			return file;
		},
		async saveFiles(file: Express.Multer.File, id: string, fileName: string, random: number, folder: string): Promise<string> {
			fileName = random + "_" + fileName;
			try {
				fs.mkdirSync(fileBaseDir + folder + "/" + id + "/", { recursive: true });
			} catch (e) {
				throw BusinessError.create(
					useBundle('file.error.noFileOrDir', { path: folder + "/" + id + "/" })
				);
			}

			fs.writeFile(fileBaseDir + folder + "/"  + id + "/" + fileName, file.buffer, function (error) {
				if (error) {
					throw BusinessError.create(
						useBundle('file.error.writeError', { path: id + "/" + fileName })
					);
				}
				logger.info(
					getMessage('file.created', { path: fileBaseDir + folder + "/"  + id + "/" + fileName })
				);
			});
			return fileBaseUrl + folder + "/"  + id + "/" + fileName;
		},
	});
}

export { initFileStorage };
export type { FileStorage };