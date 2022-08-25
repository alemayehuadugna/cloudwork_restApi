import { Router } from "express";
import { Scope } from "./controllers/AccessScopeHandler";
import { loginHandler } from "./controllers/GetTokenHandler";
import { verifyTokenHandler } from "./controllers/VerifyTokenHandler";

type Dependencies = {
	apiRouter: Router;
};

const makeAuthController = ({ apiRouter }: Dependencies) => {
	const router = Router();

	router.get("/auth", verifyTokenHandler, Scope(['Employee', 'Admin']), (req, res) => {
		res.json(req.auth);
	});
	router.post("/freelancers/login", loginHandler("Freelancer"));
	router.post("/clients/login", loginHandler("Client"));
	router.post("/employees/login", loginHandler("Employee"));

	apiRouter.use(router);
};

export { makeAuthController };
