import { UpdateClientProfileOverview } from "@/client/app/usecase/updateProfileOverview"
import { Request, Response } from "express";
import Joi from "types-joi";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";

type Dependencies = {
    updateClientProfileOverview : UpdateClientProfileOverview
};

const {getBody} = makeValidator({
    body: Joi.object({
        companyName: Joi.string(),
        websiteUrl: Joi.string(),
    }).required(),
});


const updateClientProfileOverviewHandler = handler(({updateClientProfileOverview}: Dependencies ) => async (req: Request, res: Response) => {
    let {companyName, websiteUrl} = getBody(req);

    const idObject: any = req.auth.credentials.uid;
    const id: string = idObject.value;

    const clientId = await updateClientProfileOverview({
        companyName, websiteUrl, id
    });

    res.status(HttpStatus.OK).json({clientId: clientId});
});

export {updateClientProfileOverviewHandler};
