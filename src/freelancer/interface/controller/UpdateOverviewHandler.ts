

import { UpdateOverview } from "@/freelancer/app/usecases/UpdateOverview";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	updateOverview: UpdateOverview;
}

const { getBody } = makeValidator({
	body: Joi.object({
		overview: Joi.string().min(200).required()
	}).required(),
});

const updateOverviewHandler = handler(
	({ updateOverview }: Dependencies) =>
		async (req, res) => {
			let { overview } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const freelancerId = await updateOverview({ overview, id });

			res.status(HttpStatus.OK).json({ data: { freelancerId } });
		});

export { updateOverviewHandler };