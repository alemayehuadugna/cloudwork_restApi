
import { UpdateClientBasicProfile } from "@/client/app/usecase/UpdateBasicProfile";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from "types-joi";

type Dependencies = {
    updateClientBasicProfile: UpdateClientBasicProfile;
}

const {getBody} = makeValidator({
    body: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().required()
    }).required(),
});


const updateBasicProfileHandler = handler(
    ({updateClientBasicProfile}: Dependencies) => 
    async (req: Request, res: Response) => {
        let {firstName, lastName, phone, email} = getBody(req);

        const idObject: any = req.auth.credentials.uid;
        const id: string = idObject.value;

        console.log("before editing", firstName, lastName, phone, email);
        
        const clientId = await updateClientBasicProfile({
            firstName,
            lastName,
            email,
            phone,
            id
        });
        
        
        

        res.status(HttpStatus.OK).json({clientId: clientId});
    }

)

export {updateBasicProfileHandler}