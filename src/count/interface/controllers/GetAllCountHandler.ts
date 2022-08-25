import { handler } from "@/_lib/http/handler";
import { Request, Response } from "express";
import { HttpStatus } from '@/_lib/http/HttpStatus';
import { GetAllCount } from "@/count/app/useCases/GetAllCount";

type Dependencies = {
	getAllCount: GetAllCount;
};

const getAllCountHandler = handler(
	({ getAllCount }: Dependencies) =>
		async (req: Request, res: Response) => {

			const counts = await getAllCount();

			res.status(HttpStatus.OK).json({ data: counts });
		}
);

export { getAllCountHandler };