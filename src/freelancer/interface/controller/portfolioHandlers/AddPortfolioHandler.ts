
import { AddPortfolio } from "@/freelancer/app/usecases/portfolio/AddPortfolio";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	addPortfolio: AddPortfolio;
}

const { getBody } = makeValidator({
	body: Joi.object({
		title: Joi.string().required(),
		projectUrl: Joi.string().required(),
		projectDescription: Joi.string().required(),
		skills: Joi.array().items(Joi.string()).required(),
		files: Joi.array(),
	}).required(),
});

const addPortfolioHandler = handler(
	({ addPortfolio }: Dependencies) =>
		async (req, res) => {
			let { title,
				projectUrl,
				projectDescription,
				skills,
				files } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const freelancerId = await addPortfolio({
				title, projectUrl, projectDescription, skills, files, id
			});

			res.status(HttpStatus.OK).json({ data: { freelancerId } });
		});

export { addPortfolioHandler };