import { eventConsumer } from "@/_lib/pubSub/EventEmitterConsumer";
import nodemailer from 'nodemailer';
import { MessageBundle } from "@/messages";
import { Logger } from "pino";
import { GenerateVerificationOTP } from "@/freelancer/app/usecases/GetVerificationOTP";
import { SendOTPEvent } from "@/freelancer/app/events/SendOTPEvent";

type Dependencies = {
	generateVerificationOTP: GenerateVerificationOTP;
	logger: Logger;
	messageBundle: MessageBundle;
};

const makeFreelancerCreatedEmailListener = eventConsumer<SendOTPEvent.Type, Dependencies>(
	SendOTPEvent,
	({ generateVerificationOTP, logger, messageBundle: { getMessage, useBundle } }) =>
		async (event) => {
			const code = await generateVerificationOTP({ email: event.payload.email, otpFor: event.payload.otpFor });

			let emailSubject;
			let emailMessage;
			if (event.payload.otpFor === 'Verification') {
				emailSubject = "OTP: For Email Verification";
				emailMessage = verifyEmailMessage(code);
			} else if (event.payload.otpFor === 'Forget') {
				emailSubject = "OTP: For Reset Password";
				emailMessage = forgetPasswordMessage(code);
			}

			var transporter = nodemailer.createTransport({
				host: "smtp.mailtrap.io",
				port: "2525",
				auth: {
					user: '604089871a6804',
					pass: '65434ebcdf3bac',
				}
			});

			var mailOptions = {
				from: 'cloudworkmarketplace@gmail.com',
				to: event.payload.email,
				subject: emailSubject,
				text: emailMessage
			};

			transporter.sendMail(mailOptions, function (error, info) {
				if (error) {
					logger.error(error);
				} else {
					logger.info('Verification Code Sent to ' + event.payload.email);
				}
			});

		}
);

export { makeFreelancerCreatedEmailListener };

const verifyEmailMessage = (otp) => {
	return `Dear User, \n\n`
		+ 'OTP for your email verification is : \n\n'
		+ `${otp}\n\n`
		+ 'This is a auto-generated email. Please do not reply to this email.\n\n'
		+ 'Regards\n'
}

const forgetPasswordMessage = (otp) => {
	return `Dear User, \n\n`
		+ 'OTP for Reset Password is : \n\n'
		+ `${otp}\n\n`
		+ 'This is a auto-generated email. Please do not reply to this email.\n\n'
		+ 'Regards\n'
}