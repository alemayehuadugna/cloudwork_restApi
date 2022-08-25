import { Client } from "@/client/domain/Client"

const _serializeClientForEmployee = (client: Client.Type) => {
    return {
        'clientId': client.id.value,
        'firstName': client.firstName,
        'lastName': client.lastName,
        'userName': client.userName,
        'phone': client.phone,
        'email': client.email,
        'description': client.description,
        'verified': client.verified,
        'roles': client.roles,
        'profilePicture': client.profilePicture,
        'websiteUrl' : client.websiteUrl,
        'address': client.address,
        'socialLinks': client.socialLinks,
        'companyName': client.companyName,
        'languages': client.languages,
        'rating': client.rating,
        'profileUrl': client.profileUrl,
        'completedJobs': client.completedJobs,
        'ongoingJobs': client.ongoingJobs,
        'cancelledJobs': client.cancelledJobs,
        'isProfileCompleted': client.isProfileCompleted,
        'profileCompletedPercentage': client.profileCompletedPercentage,
        'spending': client.spending,
        'state': client.state,
        'createdAt': client.createdAt,
        'updatedAt': client.updatedAt,
    }

}

const serializeForEmployee = {
    serializeForEmployee(data){
        if(!data){
            throw new Error("Expect data to be not undefined not null");
        }
        if(Array.isArray(data)) {
            return data.map(_serializeClientForEmployee);
        }
        return _serializeClientForEmployee(data);
    }
}

export {serializeForEmployee};