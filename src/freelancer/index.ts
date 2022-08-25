import { makeModule } from "@/context";
import { toContainerValues } from "@/_lib/di/containerAdapters";
import { withMongoProvider } from "@/_lib/MongoProvider";
import { asFunction } from "awilix";
import { ChangeFreelancerState, makeChangeFreelancerState } from "./app/usecases/ChangeState";
import {
	CreateFreelancer,
	makeCreateFreelancer,
} from "./app/usecases/CreateFreelancer";
import {
	DeleteFreelancer,
	makeDeleteFreelancer,
} from "./app/usecases/DeleteFreelancer";
import { GetFreelancer, makeGetFreelancer } from "./app/usecases/GetFreelancer";
import {
	ListFreelancer,
	makeListFreelancer,
} from "./app/usecases/ListFreelancer";
import { makeSearchFreelancer, SearchFreelancer } from "./app/usecases/SearchFreelancer";

import { FreelancerRepository } from "./domain/FreelancerRepository";
import {
	FreelancerCollection,
	initFreelancerCollection,
} from "./infra/FreelancerCollection";
import { makeMongoFreelancerRepository } from "./infra/FreelancerRepositoryMongo";
import { makeFreelancerController } from "./interface/router";
import { freelancerMessages } from "./messages";
import { makeUpdateProfilePicture, UpdateProfilePicture } from '@/freelancer/app/usecases/UpdateProfilePicture';
import { makeUpdateBasicProfile, UpdateBasicProfile } from "./app/usecases/UpdateBasicProfile";
import { makeUpdateExpertise, UpdateExpertise } from "./app/usecases/UpdateExpertise";
import { makeUpdateAddress, UpdateAddress } from "./app/usecases/UpdateAddress";
import { AddPortfolio, makeAddPortfolio } from "./app/usecases/portfolio/AddPortfolio";
import { EditPortfolio, makeEditPortfolio } from "./app/usecases/portfolio/EditPortfolio";
import { makeRemovePortfolio, RemovePortfolio } from "./app/usecases/portfolio/RemovePortfolio";
import { makeUpdateOverview, UpdateOverview } from "./app/usecases/UpdateOverview";
import { makeUpdateSkills, UpdateSkills } from "./app/usecases/UpdateSkills";
import { makeUpdateLanguages, UpdateLanguages } from "./app/usecases/UpdateLanguages";
import { AddEmployment, makeAddEmployment } from "./app/usecases/employment/AddEmployment";
import { EditEmployment, makeEditEmployment } from "./app/usecases/employment/EditEmployment";
import { makeRemoveEmployment, RemoveEmployment } from "./app/usecases/employment/RemoveEmployment";
import { AddEducation, makeAddEducation } from "./app/usecases/education/AddEducation";
import { EditEducation, makeEditEducation } from "./app/usecases/education/EditEducation";
import { makeRemoveEducation, RemoveEducation } from "./app/usecases/education/RemoveEducation";
import { makeUpdateSocialLinkList, UpdateSocialLinkList } from "./app/usecases/UpdateSocialLinkList";
import { AddOtherExperience, makeAddOtherExperience } from "./app/usecases/otherExperience/AddOtherExperience";
import { EditOtherExperience, makeEditOtherExperience } from "./app/usecases/otherExperience/EditOtherExperience";
import { makeRemoveOtherExperience, RemoveOtherExperience } from "./app/usecases/otherExperience/RemoveOtherExperience";
import { ChangeFreelancerPassword, makeChangeFreelancerPassword } from "./app/usecases/ChangeFreelancerPassword";
import { makeFreelancerCreatedEmailListener } from "./interface/email/FreelancerCreatedEmailListener";
import { GenerateVerificationOTP, makeGenerateVerificationOTP } from "./app/usecases/GetVerificationOTP";
import { makeVerifyEmailWithOTP, VerifyEmailWithOTP } from "./app/usecases/VerifyEmailWithOTP";
import { makeSendOTPToEmail, SendOTPToEmail } from "./app/usecases/SendOTPToEmail";
import { makeUpdateMainService, UpdateMainService } from "./app/usecases/UpdateMainService";
import { ChangeAvailability, makeChangeAvailability } from "./app/usecases/ChangeAvailability";
import { DeleteFreelancerAdmin, makeDeleteFreelancerAdmin } from '@/freelancer/app/usecases/DeleteFreelancerAdmin';
import { makeVerifyFreelancer, VerifyFreelancer } from "./app/usecases/VerifyFreelancer";



type FreelancerRegistry = {
	freelancerCollection: FreelancerCollection;
	freelancerRepository: FreelancerRepository;
	createFreelancer: CreateFreelancer;
	deleteFreelancer: DeleteFreelancer;
	deleteFreelancerAdmin: DeleteFreelancerAdmin;
	getFreelancer: GetFreelancer;
	listFreelancer: ListFreelancer;
	searchFreelancer: SearchFreelancer;
	changeFreelancerState: ChangeFreelancerState;
	updateProfilePicture: UpdateProfilePicture;
	updateBasicProfile: UpdateBasicProfile;
	updateExpertise: UpdateExpertise;
	updateAddress: UpdateAddress;
	addPortfolio: AddPortfolio;
	editPortfolio: EditPortfolio;
	removePortfolio: RemovePortfolio;
	updateOverview: UpdateOverview;
	updateSkills: UpdateSkills;
	updateLanguages: UpdateLanguages;
	addEmployment: AddEmployment;
	editEmployment: EditEmployment;
	removeEmployment: RemoveEmployment;
	addEducation: AddEducation;
	editEducation: EditEducation;
	removeEducation: RemoveEducation;
	updateSocialLinkList: UpdateSocialLinkList;
	addOtherExperience: AddOtherExperience;
	editOtherExperience: EditOtherExperience;
	removeOtherExperience: RemoveOtherExperience;
	changeFreelancerPassword: ChangeFreelancerPassword;
	generateVerificationOTP: GenerateVerificationOTP;
	verifyEmailWithOTP: VerifyEmailWithOTP;
	sendOTPToEmail: SendOTPToEmail;
	updateMainService: UpdateMainService;
	changeAvailability: ChangeAvailability;
	verifyFreelancer: VerifyFreelancer;
};

const freelancerModule = makeModule(
	"freelancer",
	async ({
		container: { register, build },
		messageBundle: { updateBundle },
	}) => {
		const collections = await build(
			withMongoProvider({
				freelancerCollection: initFreelancerCollection,
			})
		);

		updateBundle(freelancerMessages);

		register({
			...toContainerValues(collections),
			freelancerRepository: asFunction(makeMongoFreelancerRepository),
			createFreelancer: asFunction(makeCreateFreelancer),
			deleteFreelancer: asFunction(makeDeleteFreelancer),
			deleteFreelancerAdmin: asFunction(makeDeleteFreelancerAdmin),
			getFreelancer: asFunction(makeGetFreelancer),
			listFreelancer: asFunction(makeListFreelancer),
			searchFreelancer: asFunction(makeSearchFreelancer),
			changeFreelancerState: asFunction(makeChangeFreelancerState),
			updateProfilePicture: asFunction(makeUpdateProfilePicture),
			updateBasicProfile: asFunction(makeUpdateBasicProfile),
			updateExpertise: asFunction(makeUpdateExpertise),
			updateAddress: asFunction(makeUpdateAddress),
			addPortfolio: asFunction(makeAddPortfolio),
			editPortfolio: asFunction(makeEditPortfolio),
			removePortfolio: asFunction(makeRemovePortfolio),
			updateOverview: asFunction(makeUpdateOverview),
			updateSkills: asFunction(makeUpdateSkills),
			updateLanguages: asFunction(makeUpdateLanguages),
			addEmployment: asFunction(makeAddEmployment),
			editEmployment: asFunction(makeEditEmployment),
			removeEmployment: asFunction(makeRemoveEmployment),
			addEducation: asFunction(makeAddEducation),
			editEducation: asFunction(makeEditEducation),
			removeEducation: asFunction(makeRemoveEducation),
			updateSocialLinkList: asFunction(makeUpdateSocialLinkList),
			addOtherExperience: asFunction(makeAddOtherExperience),
			editOtherExperience: asFunction(makeEditOtherExperience),
			removeOtherExperience: asFunction(makeRemoveOtherExperience),
			changeFreelancerPassword: asFunction(makeChangeFreelancerPassword),
			generateVerificationOTP: asFunction(makeGenerateVerificationOTP),
			verifyEmailWithOTP: asFunction(makeVerifyEmailWithOTP),
			sendOTPToEmail: asFunction(makeSendOTPToEmail),
			updateMainService: asFunction(makeUpdateMainService),
			changeAvailability: asFunction(makeChangeAvailability),
			verifyFreelancer: asFunction(makeVerifyFreelancer)
		});

		build(makeFreelancerController);
		build(makeFreelancerCreatedEmailListener);
	}
);

export { freelancerModule };
export type { FreelancerRegistry };
