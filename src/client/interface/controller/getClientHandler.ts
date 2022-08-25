import { GetClient } from "@/client/app/usecase/GetClient";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import Joi from "types-joi";
import { serializer } from "../serializers/serializerForClient";
import { serializeForEmployee } from "../serializers/serializerForEmployee";




type Dependencies = {
  getClient: GetClient;
};

const { getParams } = makeValidator({
  params: Joi.object({
    clientId: Joi.string().required(),
  }).required(),
});

const getClientHandler = function (forWhom, type) {
  return handler(
    ({ getClient }: Dependencies) =>
      async (req: Request, res: Response) => {
        let data, para,clientId, client;
        if(forWhom === 'Employee' || forWhom === "Admin"){
          para = getParams(req);
          clientId = para.clientId;
          client = await getClient(clientId);
          
          data = serializeForEmployee.serializeForEmployee(client);
        } else if(forWhom === 'Client') {
          clientId = req.auth.credentials.uid;
          client = await getClient(clientId.value);
          data = serializer.serializeClient(client, type);
        }
        

        res.status(HttpStatus.OK).json(data);
      }
  );
};
export { getClientHandler };
