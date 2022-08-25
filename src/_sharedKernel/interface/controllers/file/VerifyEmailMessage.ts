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

export {verifyEmailMessage, forgetPasswordMessage}