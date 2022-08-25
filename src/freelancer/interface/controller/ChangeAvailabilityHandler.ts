import { ChangeAvailability } from "@/freelancer/app/usecases/ChangeAvailability"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
	changeAvailability: ChangeAvailability;
}

const { getBody } = makeValidator({
	body: Joi.object({
		available: Joi.string().valid("Full Time", "Part Time", "Not Available").required()
	}).required()
});

const changeAvailabilityHandler = handler(({ changeAvailability }: Dependencies) =>
	async (req, res) => {
		let { available } = getBody(req);
		const idObject: any = req.auth.credentials.uid;
		const id: string = idObject.value;

		let temp: "Full Time" | "Part Time" | "Not Available" =
			available === 'Full Time' ? 'Full Time' :
				available === 'Part Time' ? 'Part Time' : 'Not Available';

		await changeAvailability({ freelancerId: id, availability: temp });

		res.status(HttpStatus.OK).json();
	});

export { changeAvailabilityHandler };