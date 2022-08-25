import { messageSource } from "@/_lib/message/MessageBundle";

type FreelancerMessages = {
	freelancer: {
		error: {
			notFound: { id: string };
			alreadyExists: { id: string };
			portfolioNotFound: { id: string };
			educationNotFound: { id: string };
			employmentNotFound: { id: string };
			otherExperienceNotFound: { id: string };
			wrongPassword;
			OTPError: { message: string}
		};
		created: { id: string };
	};
};

const freelancerMessages = messageSource<FreelancerMessages>({
	freelancer: {
		error: {
			alreadyExists:
				"can't recreate the employee #({{ id }}) because it was already created.",
			notFound: "Can't find Employee #({{ id }})",
			portfolioNotFound: "Can't find Portfolio with id #({{id}})",
			educationNotFound: "Can't find Education with Id #({{id}})",
			employmentNotFound: "Can't find Employment with id #({{id}})",
			otherExperienceNotFound: "Can't find Other Experience with id #({{id}})",
			wrongPassword: "You have submitted incorrect password",
			OTPError: "Invalid OTP #({{message}})",
		},
		created: "Freelancer created with id #({{ id }})",
	},
});

export { freelancerMessages };
export type { FreelancerMessages };
