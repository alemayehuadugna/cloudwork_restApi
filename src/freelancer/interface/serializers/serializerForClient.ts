import { Freelancer } from "@/freelancer/domain/Freelancer"

const _serializeFreelancerForClient = (freelancer: Freelancer.Type) => {
	return {
		'freelancerId': freelancer.id.value,
		'firstName': freelancer.firstName,
		'lastName': freelancer.lastName,
		'gender': freelancer.gender,
		'expertise': freelancer.expertise,
		'verified': freelancer.verified,
		'joinedDate': freelancer.joinedDate,
		'profilePicture': freelancer.profilePicture,
		'skills': freelancer.skills,
		'address': freelancer.address,
		'skillRating': freelancer.rating.skill,
		'adherenceToScheduleRating': freelancer.rating.adherenceToSchedule,
		'availabilityRating': freelancer.rating.availability,
		'communicationRating': freelancer.rating.communication,
		'cooperationRating': freelancer.rating.cooperation,
		'qualityOfWorkRating': freelancer.rating.qualityOfWork,
	}
}
const _serializeDetailedFreelancerForClient = (freelancer: Freelancer.Type) => {
	return {
		'id': freelancer.id.value,
		'firstName': freelancer.firstName,
		'lastName': freelancer.lastName,
		'userName': freelancer.userName,
		'profilePicture': freelancer.profilePicture,
		'completedJobs': freelancer.completedJobs,
		'ongoingJobs': freelancer.ongoingJobs,
		'cancelledJobs': freelancer.cancelledJobs,
		'numberOfReviews': freelancer.numberOfReviews,
		'joinedDate': freelancer.joinedDate,
		'skillRating': freelancer.rating.skill,
		'qualityOfWorkRating': freelancer.rating.qualityOfWork,
		'availabilityRating': freelancer.rating.availability,
		'adherenceToScheduleRating': freelancer.rating.adherenceToSchedule,
		'communicationRating': freelancer.rating.communication,
		'cooperationRating': freelancer.rating.cooperation,
		'gender': freelancer.gender,
		'skills': freelancer.skills,
		'overview': freelancer.overview,
		'socialLinks': freelancer.socialLinks,
		'address': freelancer.address,
		'languages': freelancer.languages,
		'available': freelancer.available,
		'educations': freelancer.educations,
		'employments': freelancer.employments,
		'otherExperiences': freelancer.otherExperiences,
		'mainService': freelancer.mainService,
		'expertise': freelancer.expertise,
		'verified': freelancer.verified,
	}
}

const serializerForClient = {
	serializeForClient(data) {
		if (!data) {
			throw new Error("Expect data to be not undefined nor null");
		}
		if (Array.isArray(data)) {
			return data.map(_serializeFreelancerForClient);
		}
		return _serializeDetailedFreelancerForClient(data);
	}
}

export { serializerForClient };