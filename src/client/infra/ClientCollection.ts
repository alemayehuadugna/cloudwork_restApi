import { Language, SocialLinks } from "@/freelancer/domain/Freelancer";
import { Address } from "@/_sharedKernel/domain/entities/Address";
import { OTPSchema } from "@/_sharedKernel/domain/entities/OTP";
// import { OTPSchema } from "@/_sharedKernel/domain/entities/OTP";
import { Collection, Db } from "mongodb";
import { MUUID } from "uuid-mongodb";



type ClientSchema = {
  _id: MUUID;
  firstName: string;
  lastName: string;
  userName: string;
  phone: string;
  email: string;
  password: string;
  description?: string;
  websiteUrl?: string;
  address?: Address;
  socialLinks?: SocialLinks[];
  favorites?: FavoriteSchema[];
  companyName?: string;
  languages?: Language[];
  workCategory?: string[];
  verified: boolean;
  profilePicture: string;
  rating: Rating;
  roles: string[];
  profileUrl: string;
  spending: number;
  otp?: OTPSchema;
  isEmailVerified: boolean;
  state: "ACTIVE" | "DEACTIVATED" | "DELETED";
  deleted: boolean,
  completedJobs: number,
  ongoingJobs: number,
  cancelledJobs: number,
  isProfileCompleted: boolean,
  profileCompletedPercentage: number,
  createdAt: Date;
  updatedAt: Date;
  version: number;
};

type FavoriteSchema = {
  freelancerId: MUUID
}

type ClientCollection = Collection<ClientSchema>;

const initClientCollection = async function (
  db: Db
): Promise<ClientCollection> {
  const collection: ClientCollection = db.collection("clients");

  await collection.createIndex({ phone: 1 }, { unique: true });
  await collection.createIndex({ email: 1 }, { unique: true });
  await collection.createIndex({ userName: 1 }, { unique: true })
  await collection.createIndex({ _id: 1});
  await collection.createIndex({firstName: "text", lastName: "text", phone: "text", email: "text"});

  return collection;
};

export { initClientCollection };
export type { ClientSchema, ClientCollection };
