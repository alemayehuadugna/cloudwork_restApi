import { CreateClient } from "@/client/app/usecase/CreateClient";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from "types-joi";

type Dependencies = {
  createClient: CreateClient;
};

const { getBody } = makeValidator({
  body: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    
  }).required(),
});

const createClientHandler = handler(
  ({ createClient }: Dependencies) =>
    async (req: Request, res: Response) => {
      let {
        firstName,
        lastName,
        phone,
        email,
        password,
      } = getBody(req);

      const ClientId = await createClient({
        firstName,
        lastName,
        phone,
        email,
        password,
      });

      res.status(HttpStatus.OK).json({id: ClientId})
    }
);

export {createClientHandler}
