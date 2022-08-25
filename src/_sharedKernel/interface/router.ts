import { Router } from "express";
import { uploadFileHandler } from "./controllers/file/UploadFileHandler";
import multer from 'multer';
import { downloadFileHandler } from "./controllers/file/DownloadFileHandler";

type Dependencies = {
	apiRouter: Router;
};

const makeFileController = ({ apiRouter }: Dependencies) => {
	const router = Router();

	router.post("/files", multer().single("test"),  uploadFileHandler);
	router.get("/files/:subfolder/:userName/:fileName", downloadFileHandler);

	apiRouter.use(router);
};

export { makeFileController };