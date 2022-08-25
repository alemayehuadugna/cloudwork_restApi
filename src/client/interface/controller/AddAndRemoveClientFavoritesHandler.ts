
import { AddAndRemoveClientFavorites } from "@/client/app/usecase/AddAndRemoveClientFavorites";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from "types-joi";

type Dependencies = {
    addAndRemoveClientFavorites: AddAndRemoveClientFavorites;
}

const {getBody} = makeValidator({
    body: Joi.object({
        freelancerId: Joi.string().required()
    }).required()
})

const addAndRemoveClientFavoritesHandler = handler(({addAndRemoveClientFavorites}: Dependencies) => async (req: Request, res: Response) => {
    let {freelancerId} = getBody(req);

    const idObject: any = req.auth.credentials.uid;
    const clientId: string = idObject.value;

    const id = await addAndRemoveClientFavorites({
        freelancerId, clientId
    });

    res.status(HttpStatus.OK).json({clientId: id})
});

export {addAndRemoveClientFavoritesHandler}