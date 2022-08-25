import { ApplicationService } from "@/_lib/DDD";

type ScopeParams = {
	userScope: string[];
	allowedScope: string[];
};

type HasRole = ApplicationService<ScopeParams, boolean>;

const makeScope = (): HasRole => async (payload) => {
	const { userScope, allowedScope } = payload;

	const isFound = userScope.some((roles) => allowedScope.includes(roles));

	return isFound;
};

export { makeScope };
export type { HasRole };
