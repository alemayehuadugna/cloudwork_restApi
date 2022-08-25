import { AggregateRoot } from "@/_lib/DDD";
import { makeWithInvariants } from "@/_lib/WithInvariants";
import { Address } from "@/_sharedKernel/domain/entities/Address";
import { OTP } from "@/_sharedKernel/domain/entities/OTP";
import { ObjectId } from "mongodb";
import { FreelancerId } from "./FreelancerId";

namespace Freelancer {
	type Freelancer = AggregateRoot<FreelancerId> &
		Readonly<{
			firstName: string;
			lastName: string;
			phone: string;
			email: string;
			password: string;
			//! init from Use case
			userName: string;
			profilePicture: string;
			//! initialized on create
			completedJobs: number,
			ongoingJobs: number,
			verified: boolean,
			cancelledJobs: number,
			numberOfReviews: number,
			joinedDate: Date,
			roles: string[];
			earning: number;
			rating: FreelancerRatings;
			isProfileComplete: boolean;
			isEmailVerified: boolean;
			isPhoneVerified: boolean;
			profileCompletedPercentage: number;
			available: 'Full Time' | 'Part Time' | 'Not Available',

			//! --------------
			gender?: string;
			skills: string[];
			overview: string;
			mainService: {
				category: string;
				subCategory: string
			} | null;
			socialLinks?: SocialLinks[];
			address: Address | null;
			languages: Language[];
			portfolios: Portfolio[];
			educations: Education[];
			employments: Employment[];
			otherExperiences: OtherExperience[];
			expertise: string,
			jobOffers?: JobOffer[],
			otp?: OTP;
			state: "ACTIVE" | "DEACTIVATED";
			updatedAt: Date;
			version: number;
		}>;

	const withInvariants = makeWithInvariants<Freelancer>(function (
		self,
		assert
	) {
		assert(self.firstName?.length > 0);
		assert(self.lastName?.length > 0);
		assert(self.phone?.length > 0);
		assert(self.email?.length > 0);
		assert(self.password?.length > 0);
	});

	type FreelancerProps = Readonly<{
		id: FreelancerId;
		firstName: string;
		lastName: string;
		phone: string;
		email: string;
		password: string;
		userName: string;

	}>;

	export const create = function (props: FreelancerProps): Freelancer {
		return {
			...props,
			profilePicture: '',
			isEmailVerified: false,
			isPhoneVerified: false,
			isProfileComplete: false,
			profileCompletedPercentage: 0,
			available: 'Not Available',
			gender: undefined,
			skills: [],
			overview: "",
			expertise: '',
			socialLinks: [],
			address: null,
			mainService: null,
			languages: [],
			educations: [],
			portfolios: [],
			employments: [],
			otherExperiences: [],
			roles: ["Freelancer"],
			earning: 0.0,
			rating: {
				skill: { rate: 0.0, totalRate: 0.0, totalRaters: 0 },
				qualityOfWork: { rate: 0.0, totalRate: 0.0, totalRaters: 0 },
				availability: { rate: 0.0, totalRate: 0.0, totalRaters: 0 },
				adherenceToSchedule: {
					rate: 0.0,
					totalRate: 0.0,
					totalRaters: 0,
				},
				communication: { rate: 0.0, totalRate: 0.0, totalRaters: 0 },
				cooperation: { rate: 0.0, totalRate: 0.0, totalRaters: 0 },
			},
			completedJobs: 0,
			ongoingJobs: 0,
			cancelledJobs: 0,
			numberOfReviews: 0,
			verified: false,
			joinedDate: new Date,
			jobOffers: [],
			otp: undefined,
			state: "ACTIVE",
			updatedAt: new Date,
			version: 0,
		};
	};

	export const markAsVerified = withInvariants(function (self: Freelancer): Freelancer {
		return {
			...self,
			verified: true
		}
	});

	export const markAsEmailVerified = withInvariants(function (self: Freelancer, profileCompletedPercentage: number): Freelancer {
		return {
			...self,
			isEmailVerified: true,
			profileCompletedPercentage
		}
	});

	export const markAsPhoneVerified = withInvariants(function (self: Freelancer): Freelancer {
		return {
			...self,
			isPhoneVerified: true
		}
	});

	export const markAsProfileCompleted = withInvariants(function (self: Freelancer): Freelancer {
		return {
			...self,
			isProfileComplete: true
		}
	});

	export const changePassword = withInvariants(function (self: Freelancer, newPassword: string): Freelancer {
		return {
			...self,
			password: newPassword
		}
	});

	export const incrementOngoingJobs = withInvariants(function (self: Freelancer): Freelancer {
		return {
			...self,
			ongoingJobs: self.ongoingJobs + 1
		}
	});

  export const incrementCancelledJobs = withInvariants(function (self: Freelancer): Freelancer {
		return {
			...self,
			cancelledJobs: self.cancelledJobs + 1
		}
	});

  export const incrementCompletedJobs = withInvariants(function (self: Freelancer): Freelancer {
		return {
			...self,
			completedJobs: self.completedJobs + 1
		}
	});

	export const decrementOngoingJobs = withInvariants(function (self: Freelancer): Freelancer {
		return {
			...self,
			ongoingJobs: self.ongoingJobs - 1
		}
	});

  export const decrementCancelledJobs = withInvariants(function (self: Freelancer): Freelancer {
		return {
			...self,
			cancelledJobs: self.cancelledJobs - 1
		}
	});

  export const decrementCompletedJobs = withInvariants(function (self: Freelancer): Freelancer {
		return {
			...self,
			completedJobs: self.completedJobs - 1
		}
	});

	export const incrementNumberOfReviews = withInvariants(function (self: Freelancer): Freelancer {
		return {
			...self,
			completedJobs: self.numberOfReviews + 1
		}
	});

	export const updateEarning = withInvariants(function (self: Freelancer, earning: number): Freelancer {
		return {
			...self,
			earning
		}
	});

	export const updateOTP = withInvariants(function (self: Freelancer, otp?: OTP): Freelancer {
		return {
			...self,
			otp
		}
	});

	export const updateMainService = withInvariants(function (self: Freelancer, category: string, subCategory: string, profileCompletedPercentage: number): Freelancer {
		return {
			...self,
			mainService: {
				category,
				subCategory
			},
			profileCompletedPercentage
		}
	});

	export const updateRating = withInvariants(function (self: Freelancer, rating: FreelancerRatings): Freelancer {
		return {
			...self,
			rating
		}
	});

	export const updateJobOffer = withInvariants(function (self: Freelancer, jobOffers: JobOffer[]): Freelancer {
		return {
			...self,
			jobOffers
		}
	});

	export const changeState = withInvariants(function (self: Freelancer, state: "DEACTIVATED" | "ACTIVE"): Freelancer {
		return {
			...self,
			state: state,
		}
	});

	export const changeAvailability = withInvariants(function (self: Freelancer, availability: "Full Time" | "Part Time" | "Not Available"): Freelancer {
		return {
			...self,
			available: availability,
		}
	});

	export const updateProfilePicture = withInvariants(
		function (
			self: Freelancer,
			newProfilePicture: string,
			profileCompletedPercentage: number): Freelancer {
			return {
				...self,
				profilePicture: newProfilePicture,
				profileCompletedPercentage
			}
		});

	export const updateBasicUserInfo = withInvariants(
		function (
			self: Freelancer,
			gender: string,
			available: 'Full Time' | 'Part Time' | 'Not Available',
			profileCompletedPercentage: number)
			: Freelancer {
			return {
				...self,
				gender,
				available,
				profileCompletedPercentage
			}
		});

	export const updateExpertise = withInvariants(function (self: Freelancer, expertise: string, profileCompletedPercentage: number): Freelancer {
		return {
			...self,
			expertise,
			profileCompletedPercentage
		}
	});

	export const updateAddress = withInvariants(function (self: Freelancer, address: Address, profileCompletedPercentage: number): Freelancer {
		return {
			...self,
			address,
			profileCompletedPercentage
		}
	});

	export const updatePortfolio = withInvariants(function (self: Freelancer, profileCompletedPercentage: number, portfolios: Portfolio[],): Freelancer {
		return {
			...self,
			portfolios,
			profileCompletedPercentage
		}
	});

	export const updateOverview = withInvariants(function (self: Freelancer, overview: string, profileCompletedPercentage: number): Freelancer {
		return {
			...self,
			overview,
			profileCompletedPercentage
		}
	});

	export const updateSkills = withInvariants(function (self: Freelancer, skills: string[], profileCompletedPercentage: number): Freelancer {
		return {
			...self,
			skills,
			profileCompletedPercentage
		}
	});

	export const updateLanguage = withInvariants(function (self: Freelancer, languages: Language[], profileCompletedPercentage: number): Freelancer {
		return {
			...self,
			languages,
			profileCompletedPercentage
		}
	});

	export const updateEmployment = withInvariants(function (self: Freelancer, profileCompletedPercentage: number, employments: Employment[]): Freelancer {
		return {
			...self,
			employments,
			profileCompletedPercentage
		}
	});

	export const updateEducation = withInvariants(function (self: Freelancer, educations: Education[], profileCompletedPercentage: number): Freelancer {
		return {
			...self,
			educations,
			profileCompletedPercentage
		}
	});

	export const updateSocialLinkList = withInvariants(function (self: Freelancer, socialLinks: SocialLinks[], profileCompletedPercentage: number): Freelancer {
		return {
			...self,
			socialLinks,
			profileCompletedPercentage
		}
	});

	export const updateOtherExperienceList = withInvariants(function (self: Freelancer, otherExperiences: OtherExperience[], profileCompletedPercentage: number): Freelancer {
		return {
			...self,
			otherExperiences,
			profileCompletedPercentage
		}
	});

	export type Type = Freelancer;
}


type JobOffer = {
	clientId: string;
	jobId: string;
	message?: string;
}

type SocialLinks = {
	socialMedia: string;
	link: string;
};

type Portfolio = {
	id: ObjectId,
	title: string;
	projectUrl: string;
	projectDescription: string;
	skills: String[];
	files?: unknown[];
}

type Employment = {
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

type Education = {
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

type FreelancerRatings = {
	skill: Rating;
	qualityOfWork: Rating;
	availability: Rating;
	adherenceToSchedule: Rating;
	communication: Rating;
	cooperation: Rating;
};

type Language = {
	language: string;
	proficiencyLevel: string;
};

type OtherExperience = {
	id: ObjectId,
	subject: string;
	description: string;
};

export { Freelancer };
export type {
	SocialLinks,
	OtherExperience,
	Language,
	FreelancerRatings,
	Portfolio,
	Education,
	Employment,
	JobOffer,
	OTP
};
