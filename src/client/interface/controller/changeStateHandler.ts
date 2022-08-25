import { ChangeClientState } from "@/client/app/usecase/ChangeState";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
  changeClientState: ChangeClientState;
};

const { getBody, getParams } = makeValidator({
  params: Joi.object({
    clientId: Joi.string().required(),
  }).required(),
  body: Joi.object({
    state: Joi.string().valid("ACTIVE", "DEACTIVATED").required(),
  }).required(),
});

const changeClientStateHandler = handler(
  ({ changeClientState }: Dependencies) =>
    async (req, res) => {
      console.log("request", req);
      const { clientId } = getParams(req);
      const { state } = getBody(req);

      console.log("client id::",clientId);
      let temp: "ACTIVE" | "DEACTIVATED";
      if (state === "ACTIVE") {
        temp = "ACTIVE";
      } else {
        temp = "DEACTIVATED";
      }

      await changeClientState({ clientId, state: temp });

      res.status(HttpStatus.OK).send();
    }
);

export {changeClientStateHandler}
