import { UpdateMainService } from "@/freelancer/app/usecases/UpdateMainService"
import { handler } from "@/_lib/http/handler";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';
import { HttpStatus } from '@/_lib/http/HttpStatus';

type Dependencies = {
	updateMainService: UpdateMainService;
}

const { getBody } = makeValidator({
	body: Joi.object({
		category: Joi.string().min(1).required(),
		subcategory: Joi.string().min(1).required(),
	}).required(),
});

const updateMainServiceHandler = handler(
	({ updateMainService }: Dependencies) =>
		async (req, res) => {
			let { category, subcategory } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const freelancerId = await updateMainService({ category, subCategory: subcategory, freelancerId: id, });

			res.status(HttpStatus.OK).json({ data: { freelancerId } });
		});

export { updateMainServiceHandler };