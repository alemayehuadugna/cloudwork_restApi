import { FreelancerIdProvider } from "@/freelancer/infra/FreelancerIdProvider";
import { DataMapper } from "@/_lib/DDD";
import { from } from "uuid-mongodb";
import { Client } from "../domain/Client";
import { ClientSchema } from "./ClientCollection";
import { ClientIdProvider } from "./ClientIdProvider";

const ClientMapper: DataMapper<Client.Type, ClientSchema> = {
    toOrmEntity: (domainEntity: Client.Type): ClientSchema => ({
        _id: from(domainEntity.id.value),
        firstName: domainEntity.firstName,
        lastName: domainEntity.lastName,
        userName: domainEntity.userName,
        phone: domainEntity.phone,
        email: domainEntity.email,
        password: domainEntity.password,
        description: domainEntity.description,
        websiteUrl: domainEntity.websiteUrl,
        address: domainEntity.address,
        socialLinks: domainEntity.socialLinks,
        favorites: domainEntity.favorites?.map((fav) => {
            console.log("int the map");
            console.log(fav.freelancerId);
            return {
                freelancerId: from(fav.freelancerId),
            }
        }),
        companyName: domainEntity.companyName,
        workCategory: domainEntity.workCategory,
        verified: domainEntity.verified,
        profilePicture: domainEntity.profilePicture,
        rating: domainEntity.rating,
        roles: domainEntity.roles,
        profileUrl: domainEntity.profileUrl,
        spending: domainEntity.spending,
        state: domainEntity.state,
        completedJobs: domainEntity.completedJobs,
        ongoingJobs: domainEntity.ongoingJobs,
        cancelledJobs: domainEntity.cancelledJobs,
        isProfileCompleted: domainEntity.isProfileCompleted,
        isEmailVerified: domainEntity.isEmailVerified,
        otp: domainEntity.otp,
        profileCompletedPercentage: domainEntity.profileCompletedPercentage,
        deleted: domainEntity.state === "DELETED",
        createdAt: domainEntity.createdAt,
        updatedAt: domainEntity.updatedAt,
        version: domainEntity.version,
    }),
    toOrmEntities: function (ormEntities: Client.Type[]) {
        return ormEntities.map((entity) => this.toOrmEntity(entity));
    },
    
    toDomainEntity: (ormEntity: ClientSchema) => ({
        id: ClientIdProvider.create(from(ormEntity._id).toString()),
        firstName: ormEntity.firstName,
        lastName: ormEntity.lastName,
        userName: ormEntity.userName,
        phone: ormEntity.phone,
        email: ormEntity.email,
        password: ormEntity.password,
        description: ormEntity.description,
        websiteUrl: ormEntity.websiteUrl,
        address: ormEntity.address,
        socialLinks: ormEntity.socialLinks,
        favorites: ormEntity.favorites?.map(fav => {
            return {
                freelancerId: FreelancerIdProvider.create(from(fav.freelancerId).toString()).value
            }
        }),
        companyName: ormEntity.companyName,
        workCategory: ormEntity.workCategory,
        verified: ormEntity.verified,
        profilePicture: ormEntity.profilePicture,
        rating: ormEntity.rating,
        roles: ormEntity.roles,
        profileUrl: ormEntity.profileUrl,
        spending: ormEntity.spending,
        completedJobs: ormEntity.completedJobs,
        ongoingJobs: ormEntity.ongoingJobs,
        cancelledJobs: ormEntity.cancelledJobs,
        isProfileCompleted: ormEntity.isProfileCompleted,
        isEmailVerified: ormEntity.isEmailVerified,
        otp: ormEntity.otp,
        profileCompletedPercentage: ormEntity.profileCompletedPercentage,
        state: ormEntity.state,
        createdAt: ormEntity.createdAt,
        updatedAt: ormEntity.updatedAt,
        version: ormEntity.version,
    }),

    toDomainEntities: function (domainEntities: any[]) {
        return domainEntities.map((entity) => {
            return this.toDomainEntity(entity)
        })
    }
};

export { ClientMapper };
