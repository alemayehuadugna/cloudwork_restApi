import { FileRepository } from "@/_sharedKernel/domain/repo/FileRepository";
import { FileStorage } from "./FileStorage";
import fs from "fs";

type Dependencies = {
  fileStorage: FileStorage;
};

const fileBaseDir: string = "file_storage/";

const makeLocalFileRepository = ({
  fileStorage,
}: Dependencies): FileRepository => ({
  async save({ file, userName, folder }: any): Promise<string> {
    var random = Math.floor(Math.random() * (100000000 - 0 + 1)) + 0;

    let fileType = file?.mimetype.split("/")[1] || "file";

    const fileName = file?.fieldname + "." + fileType;
    const result = await fileStorage.save(file, userName, fileName, random, folder);
    return result;
  },
  async remove(path: string, fileName: string): Promise<boolean> {
    return true;
  },
  async read({ userName, fileName }: any): Promise<any> {
    var file: fs.ReadStream = fileStorage.read(userName, fileName);
    // .on('data', async (chunk) => {
    // 	console.log('result on data called');
    // 	result = await chunk;
    // })
    // .on('error', async (error) => {
    // 	console.log('result on error called');
    // 	file.close();
    // 	result = await error;
    // });

    return file;
  },

  async saveFiles({ files, id, folder }: any): Promise<string[]> {
    let result: any = [];
    var random;
    for (let i = 0; i < files.length; i++) {
      random = Math.floor(Math.random() * (100000000 - 0 + 1)) + 0;
      let fileType = files[i].mimetype.split("/")[1] || "file";

      const fileName = files[i].fieldname + "." + fileType;
      result[i] = await fileStorage.saveFiles(files[i], id, fileName, random, folder);
    }
    return result;
  },

  async deleteFile({ file, id, folder }: any): Promise<void> {
    console.log("path: ", fileBaseDir + folder + "/" + id + "/" + file.split("/")[7]);
    fs.unlinkSync(fileBaseDir + folder + "/" + id + "/" + file.split("/")[7]);
  },
});

export { makeLocalFileRepository };
