import { UpdateAddress } from "@/freelancer/app/usecases/UpdateAddress"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from '@/_lib/http/validation/Validator';
import Joi from 'types-joi';

type Dependencies = {
	updateAddress: UpdateAddress;
}

const { getBody } = makeValidator({
	body: Joi.object({
		region: Joi.string().required(),
		city: Joi.string().required(),
		areaName: Joi.string().allow(null, ''),
		postalCode: Joi.string().allow(null, ''),
	}).required(),
});

const updateAddressHandler = handler(
	({ updateAddress }: Dependencies) =>
		async (req, res) => {
			let {
				region,
				city,
				areaName,
				postalCode
			} = getBody(req);
			const idObject: any = req.auth.credentials.uid;
			const id: string = idObject.value;
			const tAreaName = areaName === null ? undefined : areaName;
			const tPostalCode = postalCode === null ? undefined : postalCode;

			const freelancerId = await updateAddress({
				region,
				city,
				areaName: tAreaName,
				postalCode: tPostalCode,
				id
			});

			res.status(HttpStatus.OK).json({ data: { freelancerId } });
		});

export { updateAddressHandler };