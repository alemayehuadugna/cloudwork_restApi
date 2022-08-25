import { Router } from "express";
import multer from "multer";
import { verifyTokenHandler } from "@/auth/interface/controllers/VerifyTokenHandler";
import { changeFreelancerStateHandler } from "./controller/ChangeStateHandler";
import { createFreelancerHandler } from "./controller/CreateFreelancerHandler";
import { deleteFreelancerHandler } from "./controller/DeleteFreelancerHandler";
import { getFreelancerHandler } from "./controller/GetFreelancerHandler";
import { listFreelancerHandler } from "./controller/ListFreelancersHandler";
import { addPortfolioHandler } from "./controller/portfolioHandlers/AddPortfolioHandler";
import { searchFreelancerHandler } from "./controller/SearchFreelancerHandler";
import { updateAddressHandler } from "./controller/UpdateAddressHandler";
import { updateBasicProfileHandler } from "./controller/UpdateBasicProfileHandler";
import { updateExpertiseHandler } from "./controller/UpdateExpertiseHandler";
import { uploadProfilePictureHandler } from "./controller/UpdateProfileHandler";
import { editPortfolioHandler } from "./controller/portfolioHandlers/EditPortfolioHandler";
import { removePortfolioHandler } from "./controller/portfolioHandlers/RemovePortfolioHandler";
import { updateOverviewHandler } from "./controller/UpdateOverviewHandler";
import { updateSkillsHandler } from "./controller/UpdateSkillsHandler";
import { updateLanguagesHandler } from "./controller/UpdateLanguagesHandler";
import { addEmploymentHandler } from "./controller/employmentHandlers/AddEmploymentHandler";
import { editEmploymentHandler } from "./controller/employmentHandlers/EditEmploymentHandler";
import { removeEmploymentHandler } from "./controller/employmentHandlers/RemoveEmploymentHandler";
import { addEducationHandler } from "./controller/educationHandlers/AddEducationHandler";
import { editEducationHandler } from "./controller/educationHandlers/EditEducationHandler";
import { removeEducationHandler } from "./controller/educationHandlers/RemoveEducationHandler";
import { updateSocialLinkListHandler } from "./controller/UpdateSocialLinkListHandler";
import { addOtherExperienceHandler } from "./controller/otherExperienceHandlers/AddOtherExperienceHandler";
import { editOtherExperienceHandler } from "./controller/otherExperienceHandlers/EditOtherExperienceHandler";
import { removeOtherExperienceHandler } from "./controller/otherExperienceHandlers/RemoveOtherExperienceHandler";
import { changeFreelancerPasswordHandler } from "./controller/ChangeFreelancerPasswordHandler";
import { verifyEmailWithOTPHandler } from "./controller/VerifyEmailWithOTP";
import { makeSendOTPToEmailHandler } from "./controller/SendOTPToEmailHandler";
import { updateMainServiceHandler } from "./controller/UpdateMainServiceHandler";
import { changeAvailabilityHandler } from "./controller/ChangeAvailabilityHandler";
import { Scope } from "@/auth/interface/controllers/AccessScopeHandler";
import { verifyFreelancerHandler } from "./controller/VerifyFreelancerHandler";

type Dependencies = {
	apiRouter: Router;
};

const makeFreelancerController = ({ apiRouter }: Dependencies) => {
	const router = Router();

	router.get("/freelancers", verifyTokenHandler, listFreelancerHandler);
	router.post("/freelancers", createFreelancerHandler);
	router.get("/freelancers/search", searchFreelancerHandler);
	router.get("/freelancers/me/detail", verifyTokenHandler, getFreelancerHandler('Freelancer', 'Detail'));
	router.get("/freelancers/me/basic", verifyTokenHandler, getFreelancerHandler('Freelancer', 'Basic'));
	router.patch("/freelancers/identify-verify/:freelancerId", verifyTokenHandler, verifyFreelancerHandler);
	router.get("/freelancers/:freelancerId", verifyTokenHandler, getFreelancerHandler('Employee', 'Detail'));
	router.delete("/freelancers/:freelancerId", verifyTokenHandler, Scope(['Employee', 'Admin']), deleteFreelancerHandler);
	router.patch("/freelancers/:freelancerId/state", changeFreelancerStateHandler);
	router.delete("/freelancers/me/delete", verifyTokenHandler, deleteFreelancerHandler);
	router.patch("/freelancers/me/picture", verifyTokenHandler, multer().single("profilePicture"), uploadProfilePictureHandler);
	router.patch("/freelancers/me/basic", verifyTokenHandler, updateBasicProfileHandler);
	router.patch("/freelancers/me/expertise", verifyTokenHandler, updateExpertiseHandler);
	router.patch("/freelancers/me/address", verifyTokenHandler, updateAddressHandler);
	router.patch("/freelancers/me/overview", verifyTokenHandler, updateOverviewHandler);
	router.patch("/freelancers/me/skills", verifyTokenHandler, updateSkillsHandler);
	router.patch("/freelancers/me/availability", verifyTokenHandler, changeAvailabilityHandler);
	router.patch("/freelancers/me/languages", verifyTokenHandler, updateLanguagesHandler);
	router.patch("/freelancers/me/socials", verifyTokenHandler, updateSocialLinkListHandler);
	router.patch("/freelancers/me/change-password", verifyTokenHandler, changeFreelancerPasswordHandler);
	router.post("/freelancers/me/verify/email", verifyEmailWithOTPHandler);
	router.post("/freelancers/me/otp/forget", makeSendOTPToEmailHandler("Forget"));
	router.post("/freelancers/me/otp/verification", makeSendOTPToEmailHandler("Verification"));
	router.patch("/freelancers/me/main-service", verifyTokenHandler, updateMainServiceHandler);
	//! Add, Edit, Delete Portfolio
	router.post("/freelancers/me/portfolios", verifyTokenHandler, addPortfolioHandler);
	router.patch("/freelancers/me/portfolios/:portfolioId", verifyTokenHandler, editPortfolioHandler);
	router.delete("/freelancers/me/portfolios/:portfolioId", verifyTokenHandler, removePortfolioHandler);
	//! Add, Edit, Remove Employment
	router.post("/freelancers/me/employments", verifyTokenHandler, addEmploymentHandler);
	router.patch("/freelancers/me/employments/:employmentId", verifyTokenHandler, editEmploymentHandler);
	router.delete("/freelancers/me/employments/:employmentId", verifyTokenHandler, removeEmploymentHandler);
	//! Add, Edit, Remove Education
	router.post("/freelancers/me/educations", verifyTokenHandler, addEducationHandler);
	router.patch("/freelancers/me/educations/:educationId", verifyTokenHandler, editEducationHandler);
	router.delete("/freelancers/me/educations/:educationId", verifyTokenHandler, removeEducationHandler);
	//! Add, Edit, Remove Other Experience
	router.post("/freelancers/me/other-experiences", verifyTokenHandler, addOtherExperienceHandler);
	router.patch("/freelancers/me/other-experiences/:otherExperienceId", verifyTokenHandler, editOtherExperienceHandler);
	router.delete("/freelancers/me/other-experiences/:otherExperienceId", verifyTokenHandler, removeOtherExperienceHandler);

	apiRouter.use(router);
};

export { makeFreelancerController };
