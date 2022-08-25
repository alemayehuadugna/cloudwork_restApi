import { UpdateClientSocialLinkList } from "@/client/app/usecase/updateClientSocialLinkLists";
import { handler } from "@/_lib/http/handler";
import { HttpStatus } from "@/_lib/http/HttpStatus";
import { makeValidator } from "@/_lib/http/validation/Validator";
import Joi from "types-joi";

type Dependencies = {
    updateClientSocialLinkList: UpdateClientSocialLinkList;
};

const { getBody } = makeValidator({
  body: Joi.object({
    socialLinks: Joi.array()
      .items(
        Joi.object({
          socialMedia: Joi.string().required(),
          link: Joi.string().required(),
        }).required()
      )
      .required(),
  }).required(),
});

const updateSocialLinkListHandler = handler(
  ({ updateClientSocialLinkList }: Dependencies) =>
    async (req, res) => {
      let { socialLinks } = getBody(req);
      const idObject: any = req.auth.credentials.uid;
      const id: string = idObject.value;

      console.log("socialLinks", socialLinks);

      const clientId = await updateClientSocialLinkList({
        socialLinks,
        clientId: id,
      });

      res.status(HttpStatus.OK).json({clientId: clientId});
    }
);

export { updateSocialLinkListHandler };
