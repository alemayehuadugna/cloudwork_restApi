import { UpdateClientAddress } from "@/client/app/usecase/UpdateAddress";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from "types-joi";

type Dependencies = {
  updateClientAddress: UpdateClientAddress;
};

const { getBody } = makeValidator({
  body: Joi.object({
    region: Joi.string().required(),
    city: Joi.string().required(),
    areaName: Joi.string().allow(null, ""),
    postalCode: Joi.string().allow(null, ""),
  }).required(),
});

const updateClientAddressHandler = handler(
  ({ updateClientAddress }: Dependencies) =>
    async (req: Request, res: Response) => {
      let { region, city, areaName, postalCode } = getBody(req);

      const idObject: any = req.auth.credentials.uid;
      const id: string = idObject.value;
      const tAreaName = areaName === null ? undefined : areaName;
      const tPostalCode = postalCode === null ? undefined : postalCode;

      const clientId = await updateClientAddress({
        region,
        city,
        areaName: tAreaName,
        postalCode: tPostalCode,
        id,
      });

      res.status(HttpStatus.OK).json({ clientId: clientId });
    }
);

export { updateClientAddressHandler };
