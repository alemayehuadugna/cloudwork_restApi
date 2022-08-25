import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from 'types-joi';
import { handler } from '@/_lib/http/handler';
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { DepositWithChapa } from "@/transaction/app/usecases/DepositWithChapa";

type Dependencies = {
	depositWithChapa: DepositWithChapa;
}

const { getBody } = makeValidator({
	body: Joi.object({
		amount: Joi.number().required(),
	}).required(),
});

const depositWithChapaHandler = handler(
	({ depositWithChapa }: Dependencies) => async (req, res) => {
		console.log("Deposit-With-Chapa-Handler");
		let { amount } = getBody(req);
		const idObject: any = req.auth.credentials.uid;
		const scope: String[] = req.auth.credentials.scope;
		const id: string = idObject.value;
		const userType = scope.includes('Client') ?
			'Client' : scope.includes('Freelancer') ?
				"Freelancer" : "Employee"
		console.log("amount: ", amount);
		const checkout_url = await depositWithChapa({ amount, userId: id, userType });

		res.status(HttpStatus.OK).json({ data: { checkout_url } });

	}
)

export { depositWithChapaHandler };