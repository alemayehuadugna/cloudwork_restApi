type AuthRepository = {
	generate(payload): Promise<string>;
	decode(accessToken: string);
	generateEmailVerificationToken(payload): Promise<string>;
	decodeEmailVerificationToken(token: string): Promise<any>;
	hashPassword(password: string): Promise<string>;
	comparePassword(sentPassword: string, storedPassword: string): Promise<boolean>; 
};

export { AuthRepository };
