import { UpdateSocialLinkList } from "@/freelancer/app/usecases/UpdateSocialLinkList";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	updateSocialLinkList: UpdateSocialLinkList;
}

const { getBody } = makeValidator({
	body: Joi.object({
		socialLinks: Joi.array().items(Joi.object({
			socialMedia: Joi.string().required(),
			link: Joi.string().required()
		}).required()).required()
	}).required(),
});

const updateSocialLinkListHandler = handler(
	({ updateSocialLinkList }: Dependencies) =>
		async (req, res) => {
			let { socialLinks } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const freelancerId = await updateSocialLinkList({
				socialLinks,
				freelancerId: id
			});

			res.status(HttpStatus.OK).json({ data: { freelancerId } });
		});

export { updateSocialLinkListHandler };