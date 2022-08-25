import { EditPortfolio } from '@/freelancer/app/usecases/portfolio/EditPortfolio';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';
import { makeValidator } from '@/_lib/http/validation/Validator';
import Joi from 'types-joi';

type Dependencies = {
	editPortfolio: EditPortfolio;
}

const { getBody, getParams } = makeValidator({
	params: Joi.object({
		portfolioId: Joi.string().required(),
	}).required(),
	body: Joi.object({
		title: Joi.string().required(),
		projectUrl: Joi.string().required(),
		projectDescription: Joi.string().required(),
		skills: Joi.array().items(Joi.string()).required(),
		files: Joi.array(),
	}).required(),
});

const editPortfolioHandler = handler(
	({ editPortfolio }: Dependencies) =>
		async (req, res) => {
			let { portfolioId } = getParams(req);
			let { title,
				projectUrl,
				projectDescription,
				skills,
				files } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const freelancerId = await editPortfolio({
				title,
				projectUrl,
				projectDescription,
				skills,
				files,
				freelancerId: id,
				portfolioId
			});

			res.status(HttpStatus.OK).json({ data: { freelancerId } });
		});

export { editPortfolioHandler }