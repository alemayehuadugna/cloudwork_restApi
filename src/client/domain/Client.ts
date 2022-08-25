import { Language, SocialLinks } from "@/freelancer/domain/Freelancer";
import { AggregateRoot } from "@/_lib/DDD";
import { makeWithInvariants } from "@/_lib/WithInvariants";
import { Address } from "@/_sharedKernel/domain/entities/Address";
import { OTP } from "@/_sharedKernel/domain/entities/OTP";
import { ClientId } from "./ClientId";

namespace Client {
  type Client = AggregateRoot<ClientId> &
    Readonly<{
      firstName: string;
      lastName: string;
      userName: string;
      phone: string;
      email: string;
      password: string;
      completedJobs: number;
      ongoingJobs: number;
      cancelledJobs: number;
      isProfileCompleted: boolean;
      profileCompletedPercentage: number;
      description?: string;
      websiteUrl?: string;
      address?: Address;
      socialLinks?: SocialLinks[];
      favorites?: Favorite[];
      companyName?: string;
      languages?: Language[];
      workCategory?: string[];
      verified: boolean;
      profilePicture: string;
      rating: Rating;
      roles: string[];
      profileUrl: string;
      spending: number;
      otp?: OTP;
      isEmailVerified: boolean;
      state: "ACTIVE" | "DEACTIVATED" | "DELETED";
      createdAt: Date;
      updatedAt: Date;
      version: number;
    }>;
  const withInvariants = makeWithInvariants<Client>(function (self, assert) {
    assert(self.firstName?.length > 0);
    assert(self.lastName?.length > 0);
    assert(self.phone?.length > 0);
    assert(self.email?.length > 0);
    assert(self.password?.length > 0);
  });

  type ClientProps = Readonly<{
    id: ClientId;
    firstName: string;
    lastName: string;
    userName: string;
    phone: string;
    email: string;
    password: string;
  }>;
  export const create = withInvariants(function (props: ClientProps): Client {
    return {
      ...props,
      description: "",
      completedJobs: 0,
      ongoingJobs: 0,
      cancelledJobs: 0,
      profileCompletedPercentage: 0,
      isProfileCompleted: false,
      websiteUrl: "",
      address: undefined,
      verified: false,
      profilePicture: "profile_image_url",
      spending: 0.0,
      roles: ["Client"],
      socialLinks: [],
      companyName: "",
      workCategory: [],
      profileUrl: "client/clientId",
      favorites: [],
      rating: { rate: 0.0, totalRate: 0.0, totalRaters: 0 },
      otp: undefined,
      isEmailVerified: false,
      state: "ACTIVE",
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 0,
    };
  });

  type Favorite = {
    freelancerId: string;
  };

  type SocialLinks = {
    socialMedia: string;
    link: string;
  };

  export const changeState = withInvariants(
    (self: Client, state: "DEACTIVATED" | "ACTIVE"): Client => ({
      ...self,
      state: state,
    })
  );

  export const markAsVerified = withInvariants(function (self: Client): Client {
    return {
      ...self,
      verified: true,
    };
  });

  export const markAsEmailVerified = withInvariants(function (
    self: Client
  ): Client {
    return {
      ...self,
      isEmailVerified: true,
    };
  });

  export const updateSocialLinkList = withInvariants(function(self: Client, socialLinks: SocialLinks[]): Client{
    return{
      ...self,
      socialLinks
    }
  });

  export const updateOTP = withInvariants(function (
    self: Client,
    otp?: OTP
  ): Client {
    return {
      ...self,
      otp,
    };
  });  

  export const incrementOngoingJobs = withInvariants(function (
    self: Client
  ): Client {
    return {
      ...self,
      ongoingJobs: self.ongoingJobs + 1,
    };
  });

  export const incrementCancelledJobs = withInvariants(function (
    self: Client
  ): Client {
    return {
      ...self,
      cancelledJobs: self.cancelledJobs + 1,
    };
  });

  export const incrementCompletedJobs = withInvariants(function (
    self: Client
  ): Client {
    return {
      ...self,
      completedJobs: self.completedJobs + 1,
    };
  });

  export const decrementOngoingJobs = withInvariants(function (
    self: Client
  ): Client {
    return {
      ...self,
      ongoingJobs: self.ongoingJobs - 1,
    };
  });

  export const decrementCancelledJobs = withInvariants(function (
    self: Client
  ): Client {
    return {
      ...self,
      cancelledJobs: self.cancelledJobs - 1,
    };
  });

  export const decrementCompletedJobs = withInvariants(function (
    self: Client
  ): Client {
    return {
      ...self,
      completedJobs: self.completedJobs - 1,
    };
  });

  export const updateDescription = withInvariants(
    (self: Client, description: string): Client => ({
      ...self,
      description: description,
    })
  );

  //TODO: will implement mark profile completed

  //TODO: increment Completed jobs,

  // TODO:  increment ongoing jobs,

  //TODO: increment cancelled jobs,

  //TODO: update spending,

  //TODO:update rating,

  export const changePassword = withInvariants(
    (self: Client, newPassword: string): Client => ({
      ...self,
      password: newPassword,
    })
  );
  
  export const updateClientProfilePicture = withInvariants(
    (self: Client, newProfilePicture: string): Client => ({
      ...self,
      profilePicture: newProfilePicture,
    })
  );

  export const updateBasicClientInfo = withInvariants(
    (
      self: Client,
      firstName: string,
      lastName: string,
      email: string,
      phone: string
    ): Client => ({
      ...self,
      firstName,
      lastName,
      email,
      phone,
    })
  );

  export const updateAddress = withInvariants(
    (self: Client, address: Address): Client => {
      return {
        ...self,
        address,
      };
    }
  );

  export const updateProfileOverview = withInvariants(
    (
      self: Client,
      companyName?: string,
      websiteUrl?: string
    ): Client => ({
      ...self,
      companyName,
      websiteUrl,
    })
  );

  export const updateFavorites = withInvariants(
    (self: Client, favorites: Favorite[]): Client => {
      return {
        ...self,
        favorites,
      };
    }
  );

  export type Type = Client;
}

export { Client };

export type{
  SocialLinks
}
