import { RemovePortfolio } from "@/freelancer/app/usecases/portfolio/RemovePortfolio";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	removePortfolio: RemovePortfolio;
}

const { getParams } = makeValidator({
	params: Joi.object({
		portfolioId: Joi.string().required(),
	}).required(),
});

const removePortfolioHandler = handler(
	({ removePortfolio }: Dependencies) =>
		async (req, res) => {
			let { portfolioId } = getParams(req);
			const idObject: any = req.auth.credentials.uid;
			const freelancerId: string = idObject.value;

			await removePortfolio({ freelancerId, portfolioId });

			res.status(HttpStatus.NO_CONTENT).json();
		});

export { removePortfolioHandler };