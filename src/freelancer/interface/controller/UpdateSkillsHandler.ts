
import { UpdateSkills } from "@/freelancer/app/usecases/UpdateSkills";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';

type Dependencies = {
	updateSkills: UpdateSkills;
}

const { getBody } = makeValidator({
	body: Joi.object({
		skills: Joi.array().items(Joi.string()).min(3).required()
	}).required(),
});

const updateSkillsHandler = handler(
	({ updateSkills }: Dependencies) =>
		async (req, res) => {
			let { skills } = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;

			const freelancerId = await updateSkills({ skills, id });

			res.status(HttpStatus.OK).json({ data: { freelancerId } });
		});

export { updateSkillsHandler };