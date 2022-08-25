import { asFunction } from "awilix";
import { makeModule } from "@/context";
import { makeVerifyToken, VerifyToken } from "./app/usecases/VerifyAccessToken";
import { AuthRepository } from "./domain/AuthRepository";
import { makeJWTAuthRepository } from "./infrastructure/JWTAuthRepository";
import { authMessages } from "./messages";
import { makeAuthController } from "./interface/router";
import { HasRole, makeScope } from "./app/usecases/AccessScope";
import { GenerateEmailToken, makeGenerateEmailToken } from "./app/usecases/GetEmailVerificationToken";
import { GenerateToken, makeGenerateToken } from "./app/usecases/GetAccessToken";

type AuthRegistry = {
	authRepository: AuthRepository;
	verifyToken: VerifyToken;
	generateToken: GenerateToken;
	hasRole: HasRole;
	generateEmailToken: GenerateEmailToken;
};

const authModule = makeModule(
	"auth",
	async ({
		container: { register, build },
		messageBundle: { updateBundle },
	}) => {

		updateBundle(authMessages);
		
		register({
			authRepository: asFunction(makeJWTAuthRepository),
			verifyToken: asFunction(makeVerifyToken),
			generateToken: asFunction(makeGenerateToken),
			hasRole: asFunction(makeScope),
			generateEmailToken: asFunction(makeGenerateEmailToken),
		});

		build(makeAuthController);
	}
);

export { authModule };
export type { AuthRegistry };
