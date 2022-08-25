import { Client } from "@/client/domain/Client"

 const _serializeBasicClient = (client: Client.Type) => {
    return {
        'id': client.id.value,
        'firstName': client.firstName,
        'lastName': client.lastName,
        'userName': client.userName,
        'phone': client.phone,
        'email': client.email,
        'description': client.description,
        'verified': client.verified,
        'isEmailVerified': client.isEmailVerified,
        'roles': client.roles,
        'profilePicture': client.profilePicture,
    }
}

const _serializeDetailClient = (client: Client.Type) => {
    return {
        'clientId': client.id.value,
        'firstName': client.firstName,
        'lastName': client.lastName,
        'userName': client.userName,
        'phone': client.phone,
        'email': client.email,
        'description': client.description,
        'websiteUrl' : client.websiteUrl,
        'address': client.address,
        'socialLinks': client.socialLinks,
        'favorites': client.favorites,
        'companyName': client.companyName,
        'languages': client.languages,
        'workCategory': client.workCategory,
        'verified': client.verified,
        'isEmailVerified': client.isEmailVerified,
        'profilePicture': client.profilePicture,
        'rating': client.rating,
        'roles': client.roles,
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

const serializer = {
    serializeClient(data: Client.Type, type: "Detail" | "Basic"){
        if(type === 'Detail'){
            return _serializeDetailClient(data);
        }else if(type === 'Basic'){
            return _serializeBasicClient(data);
        }
    }
}

export {serializer};
