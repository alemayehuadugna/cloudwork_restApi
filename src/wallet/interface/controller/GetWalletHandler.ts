import { GetUserWallet } from "@/wallet/app/usecases/GetUserWallet"
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { Request, Response } from "express";


type Dependencies = {
	getUserWallet: GetUserWallet;
};

const getUserWalletHandler = handler(
	({ getUserWallet }: Dependencies) =>
		async (req: Request, res: Response) => {
			const objectId = req.auth.credentials.uid;
			const id = objectId['value'];
			const wallet = await getUserWallet(id);
			res.status(HttpStatus.OK).json(wallet);
		}
)

export { getUserWalletHandler };