// import { OTPSchema } from "@/_sharedKernel/domain/entities/OTP";
import { Collection, Db, ObjectId } from "mongodb";
import { MUUID } from "uuid-mongodb";

type OTPSchema = {
	code: string;
	expirationTime: Date;
	verified: boolean;
	for: "Verification" | "2FA" | "Forget";
}

type jobOffersSchema = {
	clientId: string;
	jobId: string;
	message?: string;
}

type SocialLinksSchema = {
	socialMedia: string;
	link: string;
};

type PortfolioSchema = {
	id: ObjectId,
	title: string;
	projectUrl: string;
	projectDescription: string;
	skills: String[];
	files?: unknown[];
};

type EmploymentSchema = {
	id: ObjectId,
	company: string;
	city: string;
	region: string;
	title: string;
	period: {
		start: Date;
		end: Date;
	};
	summary: string;
};

type EducationSchema = {
	id: ObjectId,
	institution: string;
	dateAttended: {
		start: Date;
		end: Date;
	};
	degree?: string;
	areaOfStudy: string;
	description: string;
};

type FreelancerRatingsSchema = {
	skill: RatingSchema;
	qualityOfWork: RatingSchema;
	availability: RatingSchema;
	adherenceToSchedule: RatingSchema;
	communication: RatingSchema;
	cooperation: RatingSchema;
};

type LanguageSchema = {
	lang: string;
	proficiencyLevel: string;
};

type OtherExperienceSchema = {
	id: ObjectId,
	subject: string;
	description: string;
};

type FreelancerSchema = {
	_id: MUUID;
	firstName: string;
	lastName: string;
	phone: string;
	email: string;
	password: string;
	gender?: string;
	skills: string[];
	overview: string;
	completedJobs: number;
	ongoingJobs: number;
	cancelledJobs: number;
	numberOfReviews: number;
	expertise: string;
	verified: boolean;
	profilePicture: string;
	isProfileComplete: boolean;
	isEmailVerified: boolean;
	isPhoneVerified: boolean;
	profileCompletedPercentage: number;
	available: 'Full Time' | 'Part Time' | 'Not Available',
	joinedDate: Date;
	jobOffers?: jobOffersSchema[],
	socialLinks?: SocialLinksSchema[];
	address: AddressSchema | null;
	langs: LanguageSchema[];
	educations: EducationSchema[];
	employments: EmploymentSchema[];
	otherExperiences: OtherExperienceSchema[];
	portfolios: PortfolioSchema[];
	userName: string;
	mainService: {
		category: string;
		subCategory: string
	} | null;
	roles: string[];
	earning: number;
	rating: FreelancerRatingsSchema;
	otp?: OTPSchema;
	state: "ACTIVE" | "DEACTIVATED";
	updatedAt: Date;
	version: number;
};

type FreelancerCollection = Collection<FreelancerSchema>;

const initFreelancerCollection = async function (
	db: Db
): Promise<FreelancerCollection> {
	const collection: FreelancerCollection = db.collection("freelancers");

	await collection.createIndex({ phone: 1 }, { unique: true });
	await collection.createIndex({ email: 1 }, { unique: true });
	await collection.createIndex({ userName: 1 }, { unique: true });
	await collection.createIndex({ _id: 1 });
	await collection.createIndex(
		{ firstName: "text", lastName: "text", phone: "text", email: "text" });

	return collection;
};

export { initFreelancerCollection };
export type { FreelancerSchema, FreelancerCollection };
