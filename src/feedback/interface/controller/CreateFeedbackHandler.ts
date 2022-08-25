import { CreateFeedback } from "@/feedback/app/usecases/CreateFeedback";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import { Request, Response } from "express";
import joi from "types-joi";

type Dependencies = {
  createFeedback: CreateFeedback;
};

const { getBody } = makeValidator({
  body: joi.object({
      firstName: joi.string().required(),
      lastName: joi.string().required(),
      message: joi.string().required(),
      title: joi.string().required(),
    }).required(),
});

const createFeedbackHandler = handler(({ createFeedback }: Dependencies) =>
    async (req: Request, res: Response) => {
      let { firstName, lastName, message, title} = getBody(req);

      const feedbackId = await createFeedback({
          firstName,
          lastName,
          message,
          title
      });

      res.status(HttpStatus.CREATED).json({id: feedbackId});
    }
);

export {createFeedbackHandler}
