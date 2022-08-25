import { Router } from "express";
import { createClientHandler } from "@/client/interface/controller/CreateClientHandler";
import { listClientHandler } from "./controller/listClientHandler";
import { changeClientStateHandler } from "./controller/changeStateHandler";
import { getClientHandler } from "./controller/getClientHandler";
import { verifyTokenHandler } from "@/auth/interface/controllers/VerifyTokenHandler";
import { updateBasicProfileHandler } from "./controller/UpdateBasicProfileHandler";
import multer from "multer";
import { updateProfilePictureHandler } from "./controller/updateProfilePictureHandler";
import { changeClientPasswordHandler } from "./controller/ChangeClientPasswordHandler";
import { verifyClientHandler } from "./controller/VerifyClient";
import { updateClientDescriptionHandler } from "./controller/UpdateClientDescriptionHandler";
import { makeSendOTPToEmailHandlerForClient } from "./controller/SendOTPToEmailHandlerForClient";
import { verifyClientEmailWithOTPHandler } from "./controller/VerifyClientEmailWithOTPHandler";
import { addAndRemoveClientFavoritesHandler } from "./controller/AddAndRemoveClientFavoritesHandler";
import { getClientFavoritesHandler } from "./controller/GetClientFavoritesController";
import { updateClientAddressHandler } from "./controller/UpdateClientAddressHandler";
import { updateClientProfileOverviewHandler } from "./controller/UpdateProfileOverviewHandler";
import { updateSocialLinkListHandler } from "./controller/UpdateSocialLinkListHandler";
import { Scope } from "@/auth/interface/controllers/AccessScopeHandler";
import { deleteClientHandler } from "./controller/DeleteClientHandler";
import { searchClientHandler } from "./controller/SearchClientHandler";
import { resetPasswordHandler } from "./controller/resetPasswordHandler";


type Dependencies = {
  apiRouter: Router;
};

const makeClientController = ({ apiRouter }: Dependencies) => {
  const router = Router();

  router.post("/clients", createClientHandler);
  router.get("/clients/search", searchClientHandler)
  router.post("/clients/me/send/otp", makeSendOTPToEmailHandlerForClient('Verification'));
  router.post("/clients/forgotPassword", makeSendOTPToEmailHandlerForClient('Forget'));
  router.patch("/clients/resetPassword", resetPasswordHandler)
  router.post("/clients/me/verify/email", verifyClientEmailWithOTPHandler);
  router.get("/clients", verifyTokenHandler, listClientHandler);
  router.patch("/clients/:clientId/state", changeClientStateHandler);
  router.get("/clients/:clientId", getClientHandler("Employee", "Detail"));
  router.get("/clients/me/basic",verifyTokenHandler,getClientHandler("Client", "Basic"));
  router.get("/clients/me/detail",verifyTokenHandler,getClientHandler("Client", "Detail"));
  router.patch("/clients/me/basic",verifyTokenHandler,updateBasicProfileHandler);
  router.patch("/clients/me/profilePicture",verifyTokenHandler,multer().single("profilePicture"),updateProfilePictureHandler);
  router.patch("/clients/me/changePassword",verifyTokenHandler,changeClientPasswordHandler);
  router.patch("/clients/verify/:clientId", verifyClientHandler);
  router.patch("/clients/me/updateDescription", verifyTokenHandler, updateClientDescriptionHandler),
  router.patch("/clients/me/addFavorite", verifyTokenHandler, addAndRemoveClientFavoritesHandler),
  router.get("/clients/me/favorites", verifyTokenHandler, getClientFavoritesHandler),
  router.patch("/clients/me/updateAddress", verifyTokenHandler, updateClientAddressHandler)
  router.patch("/clients/me/updateProfileOverview", verifyTokenHandler, updateClientProfileOverviewHandler)
  router.patch("/clients/me/updateSocialLinks", verifyTokenHandler, updateSocialLinkListHandler),
  router.delete("/clients/:clientId", verifyTokenHandler, Scope(['Employee', "Admin"]), deleteClientHandler);
  router.delete("/clients/me/delete", verifyTokenHandler, deleteClientHandler);
  apiRouter.use(router);
};

export { makeClientController };
