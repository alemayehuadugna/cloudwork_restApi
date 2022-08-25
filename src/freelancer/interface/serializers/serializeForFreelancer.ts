import { Freelancer } from "@/freelancer/domain/Freelancer"

const _serializeBasicFreelancer = (freelancer: Freelancer.Type) => {
	return {
		'id': freelancer.id.value,
		'firstName': freelancer.firstName,
		'lastName': freelancer.lastName,
		'phone': freelancer.phone,
		'email': freelancer.email,
		'userName': freelancer.userName,
		'profilePicture': freelancer.profilePicture,
		'completedJobs': freelancer.completedJobs,
		'ongoingJobs': freelancer.ongoingJobs,
		'cancelledJobs': freelancer.cancelledJobs,
		'numberOfReviews': freelancer.numberOfReviews,
		'roles': freelancer.roles,
		'isEmailVerified': freelancer.isEmailVerified,
		'isProfileComplete': freelancer.isProfileComplete,
	}
}

const _serializeDetailFreelancer = (freelancer: Freelancer.Type) => {
	return {
		'id': freelancer.id.value,
		'firstName': freelancer.firstName,
		'lastName': freelancer.lastName,
		'phone': freelancer.phone,
		'email': freelancer.email,
		'userName': freelancer.userName,
		'profilePicture': freelancer.profilePicture,
		'completedJobs': freelancer.completedJobs,
		'ongoingJobs': freelancer.ongoingJobs,
		'cancelledJobs': freelancer.cancelledJobs,
		'numberOfReviews': freelancer.numberOfReviews,
		'joinedDate': freelancer.joinedDate,
		'roles': freelancer.roles,
		'earning': freelancer.earning,
		'skillRating': freelancer.rating.skill,
		'qualityOfWorkRating': freelancer.rating.qualityOfWork,
		'availabilityRating': freelancer.rating.availability,
		'adherenceToScheduleRating': freelancer.rating.adherenceToSchedule,
		'communicationRating': freelancer.rating.communication,
		'cooperationRating': freelancer.rating.cooperation,
		'isEmailVerified': freelancer.isEmailVerified,
		'isPhoneVerified': freelancer.isPhoneVerified,
		'isProfileComplete': freelancer.isProfileComplete,
		'profileCompletedPercentage': freelancer.profileCompletedPercentage,
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

const serializer = {
	serializeForFreelancer(data: Freelancer.Type, type: 'Detail' | 'Basic') {
		console.log(type);
		if (type === 'Detail') {
			return _serializeDetailFreelancer(data);
		}
		return _serializeBasicFreelancer(data);
	}
}

export { serializer };