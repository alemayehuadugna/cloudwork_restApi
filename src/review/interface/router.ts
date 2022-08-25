import { Router } from "express";
import { verifyTokenHandler } from '@/auth/interface/controllers/VerifyTokenHandler';
import { writeReviewHandler } from "./controller/WriteReviewHandler";
import { listReviewHandler } from "./controller/ListReviewHandler";

type Dependencies = {
	apiRouter: Router;
}

const makeReviewController = ({ apiRouter }: Dependencies) => {
	const router = Router();

	router.post("/reviews", verifyTokenHandler, writeReviewHandler);
	router.get("/users/:reviewedId/reviews", verifyTokenHandler, listReviewHandler);

	apiRouter.use(router);
}

export { makeReviewController };