
import { UpdateLanguages } from "@/freelancer/app/usecases/UpdateLanguages";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	updateLanguages: UpdateLanguages;
}

const { getBody } = makeValidator({
	body: Joi.object({
		languages: Joi.array().items(Joi.object({
			language: Joi.string().required(),
			proficiencyLevel: Joi.string().valid('Basic', 'Conversational', 'Fluent', 'Native').required()
		})).min(1).required()
	}).required(),
});

const updateLanguagesHandler = handler(
	({ updateLanguages }: Dependencies) =>
		async (req, res) => {
			let { languages } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const freelancerId = await updateLanguages({ languages, id });

			res.status(HttpStatus.OK).json({ data: { freelancerId } });
		});

export { updateLanguagesHandler };