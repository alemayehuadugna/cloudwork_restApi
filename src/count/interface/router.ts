import { Scope } from "@/auth/interface/controllers/AccessScopeHandler";
import { Router } from "express";
import { getAllCountHandler } from "./controllers/GetAllCountHandler";
import { verifyTokenHandler } from '@/auth/interface/controllers/VerifyTokenHandler';
type Dependencies = {
	apiRouter: Router;
}

const makeCountController = ({ apiRouter }: Dependencies) => {
	const router = Router();

	router.get("/counts", verifyTokenHandler, Scope(['Admin', 'Employee']), getAllCountHandler);
	apiRouter.use(router);
};

export { makeCountController };