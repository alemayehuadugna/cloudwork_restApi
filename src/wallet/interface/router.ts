import { Router } from 'express';
import { verifyTokenHandler } from '@/auth/interface/controllers/VerifyTokenHandler';
import { getUserWalletHandler } from './controller/GetWalletHandler';

type Dependencies = {
	apiRouter: Router;
};

const makeWalletController = ({ apiRouter }: Dependencies) => {
	const router = Router();

	router.get("/wallet/me", verifyTokenHandler, getUserWalletHandler);

	apiRouter.use(router);
}

export { makeWalletController };