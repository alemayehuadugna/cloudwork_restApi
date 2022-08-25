import { Freelancer } from "@/freelancer/domain/Freelancer"

const _serializeFreelancerForEmployee = (freelancer: Freelancer.Type) => {
	return {
		'freelancerId': freelancer.id.value,
		'firstName': freelancer.firstName,
		'lastName': freelancer.lastName,
		'phone': freelancer.phone,
		'email': freelancer.email,
		'gender': freelancer.gender,
		'expertise': freelancer.expertise,
		'verified': freelancer.verified,
		'joinedDate': freelancer.joinedDate,
		'userName': freelancer.userName,
		'earning': freelancer.earning,
		'state': freelancer.state,
	}
}
const _serializeDetailedFreelancerForEmployee = (freelancer: Freelancer.Type) => {
	return {
		'freelancerId': freelancer.id.value,
		'firstName': freelancer.firstName,
		'lastName': freelancer.lastName,
		'phone': freelancer.phone,
		'email': freelancer.email,
		'gender': freelancer.gender,
		'skills': freelancer.skills,
		'overview': freelancer.overview,
		'address': freelancer.address,
		'language': freelancer.languages,
		'education': freelancer.educations,
		'employments': freelancer.employments,
		'otherExperience': freelancer.otherExperiences,
		'completedJobs': freelancer.completedJobs,
		'ongoingJobs': freelancer.ongoingJobs,
		'cancelledJobs': freelancer.cancelledJobs,
		'numberOfReviews': freelancer.numberOfReviews,
		'expertise': freelancer.expertise,
		'verified': freelancer.verified,
		'joinedDate': freelancer.joinedDate,
		'profilePicture': freelancer.profilePicture,
		'userName': freelancer.userName,
		'earning': freelancer.earning,
		'rating': freelancer.rating,
	}
}

const serializerForEmployee = {
	serializeForEmployee(data) {
		if (!data) {
			throw new Error("Expect data to be not undefined nor null");
		}
		if (Array.isArray(data)) {
			return data.map(_serializeFreelancerForEmployee);
		}
		return _serializeDetailedFreelancerForEmployee(data);
	}
}

export { serializerForEmployee };