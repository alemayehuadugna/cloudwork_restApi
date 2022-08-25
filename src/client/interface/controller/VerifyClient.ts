import { VerifyClient } from "@/client/app/usecase/VerifyClient"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
    verifyClient: VerifyClient;
}

const {getParams} = makeValidator({
    params: Joi.object({
        clientId: Joi.string().required(),
    }).required()
})

const verifyClientHandler = handler(
    ({verifyClient}:Dependencies ) => 
    async (req, res) => {
        const {clientId} = getParams(req);

        console.log("client id in controller", clientId);
        await verifyClient({clientId});

        res.status(HttpStatus.OK).json({clientId: clientId})
    }
)

export {verifyClientHandler}