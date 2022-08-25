import { AuthRepository } from "../domain/AuthRepository";
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const JWT_SECRET_KEY = "d6a6a047d84d6884";
const JWT_EMAIL_SECRET_KEY = "d6a6a047d84d6884";
const SALTROUNDS = 10;



type Credentials = {
	uid: string;
	scope: [];
};

const makeJWTAuthRepository = (): AuthRepository => ({
	async generate(payload: Credentials): Promise<string> {
		console.log("generate payload: ", payload);
		return await jwt.sign(payload, JWT_SECRET_KEY);
	},
	async decode(accessToken: string): Promise<Credentials> {
		const credentials: Credentials = await jwt.verify(
			accessToken,
			JWT_SECRET_KEY
		);
		console.log("decode credentials: ", credentials);

		return credentials;
	},
	async generateEmailVerificationToken(payload: any): Promise<string> {
		return await jwt.sign(payload, JWT_EMAIL_SECRET_KEY, { expiresIn: '1h' });
	},
	async decodeEmailVerificationToken(token: string): Promise<any> {
		const decoded: any = await jwt.verify(token, JWT_EMAIL_SECRET_KEY);
		return decoded;
	},
	async hashPassword(password) {
		var hashedPassword = await bcrypt.hash(password, SALTROUNDS);
		return hashedPassword;
	},
	async comparePassword(sentPassword, storedPassword) {
		let match = await bcrypt.compare(sentPassword, storedPassword);
		return match;
	},
});

export { makeJWTAuthRepository };
