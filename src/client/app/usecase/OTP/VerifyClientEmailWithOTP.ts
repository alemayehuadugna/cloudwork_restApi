import { AuthRepository } from "@/auth/domain/AuthRepository";
import { Client } from "@/client/domain/Client";
import { ClientRepository } from "@/client/domain/ClientRepository";
import { ApplicationService } from "@/_lib/DDD";
import dayjs from "dayjs";

type Dependencies = {
  clientRepository: ClientRepository;
  authRepository: AuthRepository;
};

type VerifyClientEmailDTO = {
  otpCode: string;
  email: string;
};

type VerifyClientEmailWithOTP = ApplicationService<
  VerifyClientEmailDTO,
  string
>;

const makeVerifyClientEmailWithOTP =
  ({
    clientRepository,
    authRepository,
  }: Dependencies): VerifyClientEmailWithOTP =>
  async (payload) => {
    let client = await clientRepository.findByEmail(payload.email);
    if (!client) {
      throw Error("Client not found");
    }

    if (client.otp) {
      if (client.otp.verified != true) {
        if (!dayjs().isAfter(client.otp.expirationTime)) {
          if (payload.otpCode === client.otp.code) {
            client = Client.markAsEmailVerified(client);
            client = Client.updateOTP(client, undefined);

            await clientRepository.store(client);
          } else {
            throw Error("OTP code not equal");
          }
        } else {
          throw Error("OTP code has expired");
        }
      } else {
        throw Error("OTP code has been used");
      }
    } else {
      throw Error("OTP is null");
    }

    return authRepository.generate({ uid: client.id, scope: client.roles });
  };

export { makeVerifyClientEmailWithOTP };
export type { VerifyClientEmailWithOTP };
