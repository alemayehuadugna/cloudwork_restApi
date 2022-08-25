import { DataMapper } from "@/_lib/DDD";
import { from } from "uuid-mongodb";
import { Freelancer } from "../domain/Freelancer";
import { FreelancerSchema } from "./FreelancerCollection";
import { FreelancerIdProvider } from "./FreelancerIdProvider";

const FreelancerMapper: DataMapper<Freelancer.Type, FreelancerSchema> = {
	toOrmEntity: (domainEntity: Freelancer.Type): FreelancerSchema => ({
		_id: from(domainEntity.id.value),
		firstName: domainEntity.firstName,
		lastName: domainEntity.lastName,
		phone: domainEntity.phone,
		email: domainEntity.email,
		password: domainEntity.password,
		gender: domainEntity.gender,
		skills: domainEntity.skills,
		overview: domainEntity.overview,
		isProfileComplete: domainEntity.isProfileComplete,
		isEmailVerified: domainEntity.isEmailVerified,
		isPhoneVerified: domainEntity.isPhoneVerified,
		profileCompletedPercentage: domainEntity.profileCompletedPercentage,
		available: domainEntity.available,
		socialLinks: domainEntity.socialLinks,
		address: domainEntity.address,
		langs: domainEntity.languages?.map((item) => {
			return {
				lang: item.language,
				proficiencyLevel: item.proficiencyLevel
			}
		}),
		portfolios: domainEntity.portfolios,
		educations: domainEntity.educations,
		employments: domainEntity.employments,
		otherExperiences: domainEntity.otherExperiences,
		completedJobs: domainEntity.completedJobs,
		ongoingJobs: domainEntity.ongoingJobs,
		cancelledJobs: domainEntity.cancelledJobs,
		numberOfReviews: domainEntity.numberOfReviews,
		expertise: domainEntity.expertise,
		verified: domainEntity.verified,
		joinedDate: domainEntity.joinedDate,
		jobOffers: domainEntity.jobOffers,
		profilePicture: domainEntity.profilePicture,
		userName: domainEntity.userName,
		roles: domainEntity.roles,
		earning: domainEntity.earning,
		rating: domainEntity.rating,
		mainService: domainEntity.mainService,
		otp: domainEntity.otp,
		state: domainEntity.state,
		updatedAt: domainEntity.updatedAt,
		version: domainEntity.version,
	}),
	toOrmEntities: function (domainEntities: Freelancer.Type[]) {
		return domainEntities.map((entity) => this.toOrmEntity(entity));
	},
	toDomainEntity: (ormEntity: FreelancerSchema): Freelancer.Type => ({
		id: FreelancerIdProvider.create(from(ormEntity._id).toString()),
		firstName: ormEntity.firstName,
		lastName: ormEntity.lastName,
		phone: ormEntity.phone,
		email: ormEntity.email,
		password: ormEntity.password,
		gender: ormEntity.gender,
		skills: ormEntity.skills,
		overview: ormEntity.overview,
		isProfileComplete: ormEntity.isProfileComplete,
		isEmailVerified: ormEntity.isEmailVerified,
		isPhoneVerified: ormEntity.isPhoneVerified,
		profileCompletedPercentage: ormEntity.profileCompletedPercentage,
		available: ormEntity.available,
		socialLinks: ormEntity.socialLinks,
		address: ormEntity.address,
		languages: ormEntity.langs?.map((item) => {
			return {
				language: item.lang,
				proficiencyLevel: item.proficiencyLevel
			}
		}),
		educations: ormEntity.educations,
		employments: ormEntity.employments,
		portfolios: ormEntity.portfolios,
		otherExperiences: ormEntity.otherExperiences,
		completedJobs: ormEntity.completedJobs,
		ongoingJobs: ormEntity.ongoingJobs,
		cancelledJobs: ormEntity.cancelledJobs,
		numberOfReviews: ormEntity.numberOfReviews,
		expertise: ormEntity.expertise,
		verified: ormEntity.verified,
		joinedDate: ormEntity.joinedDate,
		jobOffers: ormEntity.jobOffers,
		profilePicture: ormEntity.profilePicture,
		userName: ormEntity.userName,
		roles: ormEntity.roles,
		earning: ormEntity.earning,
		rating: ormEntity.rating,
		mainService: ormEntity.mainService,
		otp: ormEntity.otp,
		state: ormEntity.state,
		updatedAt: ormEntity.updatedAt,
		version: ormEntity.version,
	}),
	toDomainEntities: function (ormEntities: any[]) {
		return ormEntities.map((entity) => {
			return this.toDomainEntity(entity);
		});
	},
};

export { FreelancerMapper };
