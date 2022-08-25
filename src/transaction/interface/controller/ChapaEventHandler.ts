import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from '@/_lib/http/HttpStatus';
import { VerifyChapaTransaction } from "@/transaction/app/usecases/VeirfyChapa";

type Dependencies = {
	verifyChapaTransaction: VerifyChapaTransaction;
}

const { getBody } = makeValidator({
	body: Joi.object({
		first_name: Joi.string().required(),
		last_name: Joi.string().required(),
		email: Joi.string().required(),
		currency: Joi.string().required(),
		amount: Joi.string().required(),
		charge: Joi.number().required(),
		status: Joi.string().required(),
		reference: Joi.string().required(),
		tx_ref: Joi.string().required(),
		mode: Joi.string(),
		type: Joi.string(),
		customization: Joi.object({
			title: Joi.string(),
			description: Joi.string(),
			logo: Joi.any().allow(null),
		}),
		meta: Joi.any().allow(null),
		created_at: Joi.date().required(),
		updated_at: Joi.date().required(),
	}).required(),
});

const chapaEventHandler = handler(
	({ verifyChapaTransaction }: Dependencies) => async (req, res) => {
		console.log("Chapa response: ", req.body);
		let { first_name, last_name, email, currency, amount,
			charge, status, reference, tx_ref, created_at, updated_at } = getBody(req);
		const formatedAmount = parseFloat(amount.replace(/,/g, ''));

		await verifyChapaTransaction({
			first_name,
			last_name,
			email,
			currency,
			amount: formatedAmount,
			charge,
			status,
			reference,
			tx_ref,
			created_at,
			updated_at
		});
		res.sendStatus(200);
	}
)

export { chapaEventHandler };

