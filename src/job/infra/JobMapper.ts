import { FreelancerIdProvider } from "@/freelancer/infra/FreelancerIdProvider";
import { DataMapper } from "@/_lib/DDD";
import { from } from "uuid-mongodb";
import { Job } from "../domain/Job";
import { JobSchema } from "./JobCollection";
import { JobIdProvider, MilestoneIdProvider } from "./JobIdProvider";
import MUUID from "uuid-mongodb";
import { ClientIdProvider } from "@/client/infra/ClientIdProvider";

type JobDataMapper = {

	toProposalDomainEntity(ormEntity: JobSchema): Job.Type;
	toDomainEntityForClient(ormEntity: JobSchema): Job.Type;
	toDomainEntitiesForClient(ormEntities: any[]): Job.Type[];
	toProposalDomainEntities(ormEntities: any[]): Job.Type[]; 
}
const JobMapper: DataMapper<Job.Type, JobSchema> & JobDataMapper = {
	toOrmEntity: (domainEntity: Job.Type): JobSchema => ({
		_id: from(domainEntity.id.value),
		clientId: from(domainEntity.clientId),
		freelancerId:
			domainEntity.freelancerId == undefined
				? domainEntity.freelancerId
				: from(domainEntity.freelancerId!),
		title: domainEntity.title,
		description: domainEntity.description,
		budget: domainEntity.budget,
		duration: domainEntity.duration,
		proposals: domainEntity.proposals,
		expiry: domainEntity.expiry,
		skills: domainEntity.skills,
		links: domainEntity.links,
		experience: domainEntity.experience,
		startDate: domainEntity.startDate,
		qualification: domainEntity.qualification,
		category: domainEntity.category,
		lang: domainEntity.language,
		question: domainEntity.question,
		progress: domainEntity.progress,
		files: domainEntity.files,
		milestones: domainEntity.milestones!.map((item) => {
			return {
				milestoneId: from(item.milestoneId),
				name: item.name,
				budget: item.budget,
				startDate: item.startDate,
				endDate: item.endDate,
				description: item.description,
				state: item.state,
				datePaid: item.datePaid,
			};
		}),
		attachments: domainEntity.attachments,
		bid: domainEntity.bid.map((item) => {
			return {
				freelancerId: from(item.freelancerId),
				budget: item.budget,
				hours: item.hours,
				coverLetter: item.coverLetter,
				isTermsAndConditionAgreed: item.isTermsAndConditionAgreed,
				createdAt: item.createdAt,
			};
		}),
		deleted: domainEntity.progress === "DELETED",
		createdAt: domainEntity.createdAt,
		updatedAt: domainEntity.updatedAt,
		version: domainEntity.version,
	}),
	toOrmEntities: function (domainEntities: Job.Type[]) {
		return domainEntities.map((entity) => this.toOrmEntity(entity));
	},
	toDomainEntity: (ormEntity: any): Job.Type => ({
		id: JobIdProvider.create(from(ormEntity._id).toString()),
		clientId: ClientIdProvider.create(from(ormEntity.clientId).toString())
			.value,
		freelancerId:
			ormEntity.freelancerId == null
				? null
				: ormEntity.freelancer == null
					? FreelancerIdProvider.create(from(ormEntity.freelancerId).toString())
						.value
					: ormEntity.freelancer.map((single) => ({
						freelancerId: MUUID.from(single._id).toString(),
						firstName: single.firstName,
						lastName: single.lastName,
						profilePicture: single.profilePicture,
					})),
		title: ormEntity.title,
		description: ormEntity.description,
		budget: ormEntity.budget,
		duration: ormEntity.duration,
		proposals: ormEntity.proposals,
		expiry: ormEntity.expiry,
		skills: ormEntity.skills,
		links: ormEntity.links,
		experience: ormEntity.experience,
		startDate: ormEntity.startDate,
		qualification: ormEntity.qualification,
		category: ormEntity.category,
		language: ormEntity.lang,
		question: ormEntity.question,
		progress: ormEntity.progress,
		files: ormEntity.files,
		milestones: ormEntity.milestones.map((item) => {
			return {
				milestoneId: MilestoneIdProvider.create(
					from(item.milestoneId).toString()
				).value,
				name: item.name,
				budget: item.budget,
				startDate: item.startDate,
				endDate: item.endDate,
				description: item.description,
				state: item.state,
				datePaid: item.datePaid,
			};
		}),
		attachments: ormEntity.attachments,
		bid: ormEntity.bid.map((item) => {
			return {
				freelancerId: FreelancerIdProvider.create(
					from(item.freelancerId).toString()
				).value,
				budget: item.budget,
				hours: item.hours,
				coverLetter: item.coverLetter,
				isTermsAndConditionAgreed: item.isTermsAndConditionAgreed,
				createdAt: item.createdAt,
			};
		}),
		createdAt: ormEntity.createdAt,
		updatedAt: ormEntity.updatedAt,
		version: ormEntity.version,
	}),

	toDomainEntities: function (domainEntities: any[]) {
		return domainEntities.map((entity) => {
			return this.toDomainEntity(entity);
		});
	},

	toDomainEntityForClient: (ormEntity: any): Job.Type => ({
		id: JobIdProvider.create(from(ormEntity._id).toString()),
		clientId:
			ormEntity.clientId == null
				? null
				: ormEntity.client == null
					? ClientIdProvider.create(from(ormEntity.clientId).toString()).value
					: ormEntity.client.map((single) => ({
						clientId: MUUID.from(single._id).toString(),
						firstName: single.firstName,
						lastName: single.lastName,
						profilePicture: single.profilePicture,
						completedJobs: single.completedJobs, 
						createdAt: single.createdAt
					})),
		freelancerId: FreelancerIdProvider.create(
			from(ormEntity.clientId).toString()
		).value,
		title: ormEntity.title,
		description: ormEntity.description,
		budget: ormEntity.budget,
		duration: ormEntity.duration,
		proposals: ormEntity.proposals,
		expiry: ormEntity.expiry,
		skills: ormEntity.skills,
		links: ormEntity.links,
		experience: ormEntity.experience,
		startDate: ormEntity.startDate,
		qualification: ormEntity.qualification,
		category: ormEntity.category,
		language: ormEntity.lang,
		question: ormEntity.question,
		progress: ormEntity.progress,
		files: ormEntity.files,
		milestones: ormEntity.milestones.map((item) => {
			return {
				milestoneId: MilestoneIdProvider.create(
					from(item.milestoneId).toString()
				).value,
				name: item.name,
				budget: item.budget,
				startDate: item.startDate,
				endDate: item.endDate,
				description: item.description,
				state: item.state,
				datePaid: item.datePaid,
			};
		}),
		attachments: ormEntity.attachments,
		bid: ormEntity.bid.map((item) => {
			return {
				freelancerId: FreelancerIdProvider.create(
					from(item.freelancerId).toString()
				).value,
				budget: item.budget,
				hours: item.hours,
				coverLetter: item.coverLetter,
				isTermsAndConditionAgreed: item.isTermsAndConditionAgreed,
				createdAt: item.createdAt,
				freelancer: {
					firstName: item.freelancer.firstName,
					lastName: item.freelancer.lastName,
					profilePicture: item.freelancer.profilePicture,
					numberOfReviews: item.freelancer.numberOfReviews
				},
			};
		}),
		createdAt: ormEntity.createdAt,
		updatedAt: ormEntity.updatedAt,
		version: ormEntity.version,
	}),

	toDomainEntitiesForClient: function (domainEntities: any[]) {
		return domainEntities.map((entity) => {
			return this.toDomainEntityForClient(entity);
		});
	},

	toProposalDomainEntity: (ormEntity: any): Job.Type => ({
		id: JobIdProvider.create(from(ormEntity._id).toString()),
		clientId: ClientIdProvider.create(from(ormEntity.clientId).toString())
			.value,
		freelancerId:
			ormEntity.freelancerId == null
				? null
				: ormEntity.freelancer == null
					? FreelancerIdProvider.create(from(ormEntity.freelancerId).toString())
						.value
					: ormEntity.freelancer.map((single) => ({
						freelancerId: MUUID.from(single._id).toString(),
						firstName: single.firstName,
						lastName: single.lastName,
						profilePicture: single.profilePicture
					})),
		title: ormEntity.title,
		description: ormEntity.description,
		budget: ormEntity.budget,
		duration: ormEntity.duration,
		proposals: ormEntity.proposals,
		expiry: ormEntity.expiry,
		skills: ormEntity.skills,
		links: ormEntity.links,
		experience: ormEntity.experience,
		startDate: ormEntity.startDate,
		qualification: ormEntity.qualification,
		category: ormEntity.category,
		language: ormEntity.lang,
		question: ormEntity.question,
		progress: ormEntity.progress,
		files: ormEntity.files,
		milestones: ormEntity.milestones.map((item) => {
			return {
				milestoneId: MilestoneIdProvider.create(
					from(item.milestoneId).toString()
				).value,
				name: item.name,
				budget: item.budget,
				startDate: item.startDate,
				endDate: item.endDate,
				description: item.description,
				state: item.state,
				datePaid: item.datePaid,
			};
		}),
		attachments: ormEntity.attachments,
		bid: ormEntity.bid.map((item) => {
			return {
				freelancerId: FreelancerIdProvider.create(
					from(item.freelancerId).toString()
				).value,
				budget: item.budget,
				hours: item.hours,
				coverLetter: item.coverLetter,
				isTermsAndConditionAgreed: item.isTermsAndConditionAgreed,
				createdAt: item.createdAt,
				freelancer: {
					firstName: item.freelancer.firstName,
					lastName: item.freelancer.lastName,
					profilePicture: item.freelancer.profilePicture,
					numberOfReviews: item.freelancer.numberOfReviews
				},
			};
		}),
		createdAt: ormEntity.createdAt,
		updatedAt: ormEntity.updatedAt,
		version: ormEntity.version,
	}),

	toProposalDomainEntities: function (domainEntities: any[]) {
		return domainEntities.map((entity) => {
			return this.toProposalDomainEntity(entity);
		});
	},
};

export { JobMapper };
