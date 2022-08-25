import { GenerateVerificationOTP } from "@/client/app/usecase/GetVerificationOTP";
import { eventConsumer } from "@/_lib/pubSub/EventEmitterConsumer";
import { Logger } from "pino";
import nodemailer from "nodemailer";
import { SendClientOTPEvent } from "@/client/app/events/SendClientOTPEvent";

type Dependencies = {
  generateVerificationOTP: GenerateVerificationOTP;
  logger: Logger;
};

const makeClientCreatedEmailListener = eventConsumer<
  SendClientOTPEvent.Type,
  Dependencies
>(
  SendClientOTPEvent,
  ({ generateVerificationOTP, logger }) =>
    async (event) => {
      const code = await generateVerificationOTP({
        email: event.payload.email,
        otpFor: event.payload.otpFor,
      });

      let emailSubject;
      let emailMessage;
      if (event.payload.otpFor === "Verification") {
        emailSubject = "OTP: For Email Verification";
        emailMessage = verifyEmailMessage(code);
      } else if (event.payload.otpFor === "Forget") {
        emailSubject = "OTP: For Reset Password";
        emailMessage = forgetPasswordMessage(code);
      }

      try {
        var transporter = nodemailer.createTransport({
          host: "smtp.mailtrap.io",
          port: "2525",
          auth: {
            user: "604089871a6804",
            pass: "65434ebcdf3bac",
          },
        });
      } catch (error) {
        console.log(error);
      }

      var mailOptions = {
        from: "cloudworkmarketplace@gmail.com",
        to: event.payload.email,
        subject: emailSubject,
        text: emailMessage,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          logger.info(error);
        } else {
          logger.info("Verification Code Sent to " + event.payload.email);
        }
      });
    }
);

export { makeClientCreatedEmailListener };

const verifyEmailMessage = (otp) => {
  return (
    `Dear User, \n\n` +
    "OTP for your email verification is : \n\n" +
    `${otp}\n\n` +
    "This is a auto-generated email. Please do not reply to this email.\n\n" +
    "Regards\n"
  );
};

const forgetPasswordMessage = (otp) => {
  return (
    `Dear User, \n\n` +
    "OTP for Reset Password is : \n\n" +
    `${otp}\n\n` +
    "This is a auto-generated email. Please do not reply to this email.\n\n" +
    "Regards\n"
  );
};
