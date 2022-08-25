import { UpdateClientDescription } from "@/client/app/usecase/UpdateDescription"
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from "types-joi";

type Dependencies = {
    updateClientDescription: UpdateClientDescription;
}


const {getBody} = makeValidator({
    body: Joi.object({
        description: Joi.string().required()
    }).required()
})

const updateClientDescriptionHandler = handler(({updateClientDescription}:Dependencies) => 
async (req : Request, res: Response) => {
    let {description} = getBody(req);
    
    const idObject: any = req.auth.credentials.uid;
    const clientId: string = idObject.value;

    const id = await updateClientDescription({
        description, clientId
    });

    res.status(HttpStatus.OK).json({clientId: id})
});

export {updateClientDescriptionHandler}