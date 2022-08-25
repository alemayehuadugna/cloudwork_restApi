import { Router } from "express";
import { verifyTokenHandler } from '@/auth/interface/controllers/VerifyTokenHandler';
import { withdrawTransactionHandler } from "./controller/WithdrawTransactionHandler";
import { depositTransactionHandler } from "./controller/DepositTransactionHandler";
import { approveTransactionHandler } from "./controller/ApproveTransactionHandler";
import { cancelTransactionHandler } from "./controller/CancelTransactionHandler";
import { holdTransactionHandler } from "./controller/HoldTransactionHandler";
import { listTransactionHandler } from "./controller/ListTransactionHandler";
import { depositWithChapaHandler } from "./controller/DepositWithChapaHandler";
import { chapaEventHandler } from "./controller/ChapaEventHandler";

type Dependencies = {
	apiRouter: Router;
};

const makeTransactionController = ({ apiRouter }: Dependencies) => {
	const router = Router();

	router.post("/transactions/withdraw", verifyTokenHandler, withdrawTransactionHandler);
	router.post("/transactions/deposit", verifyTokenHandler, depositTransactionHandler);
	router.post("/transactions/chapa/deposit", verifyTokenHandler, depositWithChapaHandler);
	router.post("/transactions/chapa/hook", chapaEventHandler);
	router.patch("/transactions/approve/:transactionId", verifyTokenHandler, approveTransactionHandler);
	router.patch("/transactions/cancel/:transactionId", verifyTokenHandler, cancelTransactionHandler);
	router.patch("/transactions/hold/:transactionId", verifyTokenHandler, holdTransactionHandler);
	router.get("/transactions", verifyTokenHandler, listTransactionHandler);

	apiRouter.use(router);
};

export { makeTransactionController };