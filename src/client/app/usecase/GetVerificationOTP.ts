import { ClientRepository } from "@/client/domain/ClientRepository";
import otpGenerator from "otp-generator";
import { ApplicationService } from "@/_lib/DDD";
import { Client } from "@/client/domain/Client";
import dayjs from "dayjs";

type Dependencies = {
  clientRepository: ClientRepository;
};

type VerificationOTPDTO = {
  email: string;
  otpFor: "2FA" | "Verification" | "Forget";
};

type GenerateVerificationOTP = ApplicationService<VerificationOTPDTO, string>;

const makeGenerateVerificationOTP =
  ({ clientRepository }: Dependencies): GenerateVerificationOTP =>
  async (payload) => {
    const code = otpGenerator.generate(4, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const expirationTime: Date = dayjs().add(15, "m").toDate();

    const otp = {
      code,
      expirationTime,
      verified: false,
      for: payload.otpFor,
    };

    let client = await clientRepository.findByEmail(payload.email);
    if(client){
        client = Client.updateOTP(client, otp);
        console.log("client otp", client);
        await clientRepository.store(client);
    }

    return code;
  };

  export {makeGenerateVerificationOTP};
  export type  {GenerateVerificationOTP}