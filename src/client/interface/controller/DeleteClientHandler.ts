import { DeleteClientAdmin } from "@/client/app/usecase/DeleteClientAdmin";
import { DeleteClient } from "@/client/app/usecase/DeleteClient"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
    deleteClient: DeleteClient;
    deleteClientAdmin: DeleteClientAdmin
};

const {getBody, getParams} = makeValidator({
    params: Joi.object({
		clientId: Joi.string(),
	}).required(),
    body:  Joi.object({
		reason: Joi.string(),
		password: Joi.string(),
	}).required(),
});

const deleteClientHandler = handler(({deleteClient, deleteClientAdmin} : Dependencies ) => async (req, res) => {
    console.log("here again");
    const {password, reason} = getBody(req);
    const {clientId} = getParams(req);
    const scope: string[] = req.auth.credentials.scope;
    const idObject: any = req.auth.credentials.uid;
    const id: string = idObject.value;

    let cId: string = '';


    if(scope.includes("Admin") || scope.includes("Employee")){
        cId = clientId!;
        await deleteClientAdmin(clientId!);
    }else{
        cId = id
        await deleteClient({id, reason, password: password!});
    }

    res.status(HttpStatus.OK).send({clientId: cId});
});

export {deleteClientHandler};