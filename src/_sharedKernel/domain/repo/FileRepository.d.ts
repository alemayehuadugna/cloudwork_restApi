
type FileRepository = {
	save({ file, userName, folder }: any): Promise<string>;
	saveFiles({file, id, folder}: any): Promise<string[]>;
	remove(path: string, fileName: string): Promise<boolean>;
	read({ userName, fileName }: any): Promise<any>;
	deleteFile({file, id, folder}: any): Promise<void>;
}

export { FileRepository };